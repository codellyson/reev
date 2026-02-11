import { NextRequest, NextResponse } from "next/server";
import { transaction, queryOne } from "@/lib/db";

const VALID_EVENT_TYPES = new Set([
  "pageview",
  "click",
  "scroll",
  "form",
  "error",
  "vitals",
  "page_leave",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, projectId, events } = body;

    if (!sessionId || !projectId || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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

      for (const event of events) {
        const eventType = String(event.type || "unknown");
        if (!VALID_EVENT_TYPES.has(eventType)) continue;

        const url = event.data?.url || pageUrl || null;
        const data = event.data || {};

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
      }

      if (placeholders.length > 0) {
        await client.query(
          `INSERT INTO page_events (session_id, event_type, url, data, timestamp)
           VALUES ${placeholders.join(", ")}`,
          values
        );
      }
    }
  });
}
