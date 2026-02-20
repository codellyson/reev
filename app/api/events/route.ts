import { NextRequest, NextResponse } from "next/server";
import { transaction, queryOne } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const VALID_EVENT_TYPES = new Set([
  "pageview",
  "click",
  "scroll",
  "form",
  "error",
  "vitals",
  "page_leave",
  "ux_issue",
  "ux_feedback",
]);

const MAX_EVENTS_PER_BATCH = 50;
const MAX_PAYLOAD_BYTES = 512 * 1024; // 512 KB
const MAX_STR_LEN = 2000;

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP: 60 requests/minute
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { allowed } = rateLimit(`events:${ip}`, 60, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Check payload size before parsing
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: "Payload too large" },
        { status: 413, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const body = await request.json();
    const { sessionId, projectId, events } = body;

    if (!sessionId || !projectId || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate field formats
    if (typeof sessionId !== "string" || sessionId.length > 100) {
      return NextResponse.json(
        { success: false, error: "Invalid session ID" },
        { status: 400 }
      );
    }
    if (typeof projectId !== "string" || projectId.length > 100) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Limit batch size
    if (events.length > MAX_EVENTS_PER_BATCH) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_EVENTS_PER_BATCH} events per batch` },
        { status: 400 }
      );
    }

    const project = await queryOne<{ id: string; website_url: string }>(
      `SELECT id, website_url FROM projects WHERE id = $1`,
      [projectId]
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID" },
        { status: 401 }
      );
    }

    if (events.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    const pageUrl = extractPageUrl(events);

    if (pageUrl && process.env.NODE_ENV === "production") {
      try {
        const projectOrigin = new URL(project.website_url).origin;
        const eventOrigin = new URL(pageUrl).origin;
        if (eventOrigin !== projectOrigin) {
          return NextResponse.json(
            { success: false, error: "Events must originate from the registered website" },
            { status: 403 }
          );
        }
      } catch {
        // Skip validation if URLs can't be parsed
      }
    }

    const userAgent = request.headers.get("user-agent") || null;

    await processEvents(sessionId, projectId, events, pageUrl, userAgent);

    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error processing events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process events" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function extractPageUrl(events: any[]): string | null {
  for (const event of events) {
    if (event.type === "pageview" && event.data?.url) {
      return event.data.url;
    }
  }
  return null;
}

async function processEvents(
  sessionId: string,
  projectId: string,
  events: any[],
  pageUrl: string | null,
  userAgent: string | null
) {
  await transaction(async (client) => {
    // Upsert session
    const existingSession = await client.query(
      `SELECT id FROM sessions WHERE id = $1`,
      [sessionId]
    );

    if (existingSession.rows.length === 0) {
      await client.query(
        `INSERT INTO sessions (id, project_id, page_url, user_agent, started_at, last_event_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [sessionId, projectId, pageUrl, userAgent]
      );
    } else {
      await client.query(
        `UPDATE sessions
         SET last_event_at = NOW(),
             page_url = COALESCE($2, page_url),
             user_agent = COALESCE($3, user_agent)
         WHERE id = $1`,
        [sessionId, pageUrl, userAgent]
      );
    }

    // Insert into page_events
    if (events.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];
      let paramIndex = 1;

      // Collect feedback events for separate storage
      const feedbackEvents: any[] = [];

      for (const event of events) {
        const eventType = String(event.type || "unknown");
        if (!VALID_EVENT_TYPES.has(eventType)) continue;

        const url = String(event.data?.url || event.data?.pageUrl || pageUrl || "").slice(0, MAX_STR_LEN) || null;
        const data = sanitizeEventData(event.data || {});

        placeholders.push(
          `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`
        );
        values.push(
          sessionId,
          eventType,
          url,
          JSON.stringify(data),
          event.timestamp || 0
        );
        paramIndex += 5;

        // Collect ux_feedback events for the feedback table
        if (eventType === "ux_feedback") {
          feedbackEvents.push({
            issueType: data.issueType,
            issueSeverity: data.issueSeverity,
            issueSelector: data.issueSelector,
            message: data.message,
            pageUrl: data.pageUrl || url,
            deviceType: data.deviceType || null,
            browserName: data.browserName || null,
            context: {
              timeOnPage: data.timeOnPage || null,
              domSnapshot: data.domSnapshot || null,
              consoleErrors: data.consoleErrors || [],
              breadcrumbs: data.breadcrumbs || [],
            },
          });
        }
      }

      if (placeholders.length > 0) {
        await client.query(
          `INSERT INTO page_events (session_id, event_type, url, data, timestamp)
           VALUES ${placeholders.join(", ")}`,
          values
        );
      }

      // Insert feedback into dedicated table
      for (const fb of feedbackEvents) {
        await client.query(
          `INSERT INTO feedback (session_id, project_id, issue_type, issue_severity, issue_selector, message, page_url, device, browser, context)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            sessionId,
            projectId,
            fb.issueType || "unknown",
            fb.issueSeverity,
            fb.issueSelector,
            fb.message,
            fb.pageUrl,
            fb.deviceType,
            fb.browserName,
            JSON.stringify(fb.context),
          ]
        );

        // Auto-compute pattern for this feedback's issue_type + page_url
        if (fb.pageUrl) {
          let pagePath: string;
          try {
            pagePath = new URL(fb.pageUrl).pathname;
          } catch {
            pagePath = fb.pageUrl;
          }
          const issueType = fb.issueType || "unknown";

          const group = await client.query(
            `SELECT COUNT(*) as cnt, MIN(created_at) as first_seen, MAX(created_at) as last_seen
             FROM feedback
             WHERE project_id = $1 AND issue_type = $2 AND page_url ILIKE $3`,
            [projectId, issueType, `%${pagePath}%`]
          );

          const count = parseInt(group.rows[0]?.cnt || "0", 10);
          if (count >= 2) {
            const LABELS: Record<string, string> = {
              rage_click: "Rage clicks",
              dead_link: "Dead links",
              broken_image: "Broken images",
              form_frustration: "Form frustration",
            };
            const title = `${LABELS[issueType] || issueType} on ${pagePath}`;

            await client.query(
              `INSERT INTO patterns (project_id, issue_type, page_url_pattern, title, report_count, first_seen_at, last_seen_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT (project_id, issue_type, page_url_pattern) DO UPDATE
               SET report_count = $5, last_seen_at = $7, title = $4`,
              [projectId, issueType, pagePath, title, count, group.rows[0].first_seen, group.rows[0].last_seen]
            );
          }
        }
      }
    }
  });
}

function sanitizeEventData(data: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      out[key] = value.slice(0, MAX_STR_LEN);
    } else if (typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
    } else if (Array.isArray(value)) {
      out[key] = value.slice(0, 50);
    } else if (value && typeof value === "object") {
      out[key] = sanitizeEventData(value);
    }
  }
  return out;
}
