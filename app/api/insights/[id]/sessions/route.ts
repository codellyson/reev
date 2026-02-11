import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

function detectDevice(userAgent: string | null): "desktop" | "mobile" | "tablet" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") && !ua.includes("tablet")) return "mobile";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  return "desktop";
}

const SESSION_QUERIES: Record<string, (url: string, metadata: Record<string, any>) => { where: string; params: any[] }> = {
  rage_click: (url, metadata) => ({
    where: `pe.event_type = 'click' AND (pe.data->>'isRage')::boolean = true AND pe.url = $3 AND pe.data->>'selector' = $4`,
    params: [url, metadata.selector],
  }),
  scroll_dropoff: (url) => ({
    where: `pe.event_type = 'scroll' AND pe.url = $3 AND (pe.data->>'maxDepth')::numeric < 30`,
    params: [url],
  }),
  form_abandonment: (url, metadata) => ({
    where: `pe.event_type = 'form' AND pe.url = $3 AND pe.data->>'formId' = $4 AND pe.data->>'action' = 'abandon'`,
    params: [url, metadata.formId],
  }),
  slow_page: (url) => ({
    where: `pe.event_type = 'vitals' AND pe.url = $3 AND pe.data->>'metric' = 'lcp' AND (pe.data->>'value')::numeric > 2500`,
    params: [url],
  }),
  error_spike: (url) => ({
    where: `pe.event_type = 'error' AND pe.url = $3`,
    params: [url],
  }),
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(request);
    const { id } = await params;

    const insight = await queryOne<{
      id: string;
      project_id: string;
      type: string;
      url: string | null;
      metadata: Record<string, any>;
    }>(
      `SELECT i.id, i.project_id, i.type, i.url, i.metadata
       FROM insights i
       JOIN projects p ON p.id = i.project_id
       WHERE i.id = $1 AND p.user_id = $2`,
      [id, userId]
    );

    if (!insight) {
      return NextResponse.json(
        { success: false, error: "Insight not found" },
        { status: 404 }
      );
    }

    const queryBuilder = SESSION_QUERIES[insight.type];
    if (!queryBuilder || !insight.url) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { where, params: extraParams } = queryBuilder(insight.url, insight.metadata || {});

    const sessions = await query<{
      id: string;
      project_id: string;
      page_url: string;
      user_agent: string;
      started_at: string;
      last_event_at: string;
      duration: number;
      clicks: number;
      errors: number;
    }>(
      `SELECT DISTINCT ON (s.id) s.id, s.project_id, s.page_url, s.user_agent,
              s.started_at, s.last_event_at, s.duration, s.clicks, s.errors
       FROM sessions s
       JOIN page_events pe ON pe.session_id = s.id
       WHERE s.project_id = $1
         AND pe.created_at >= CURRENT_DATE - 7
         AND ${where}
       ORDER BY s.id, s.started_at DESC
       LIMIT 20`,
      [insight.project_id, ...extraParams]
    );

    const mapped = sessions.map((s) => ({
      id: s.id,
      projectId: s.project_id,
      pageUrl: s.page_url,
      userAgent: s.user_agent,
      device: detectDevice(s.user_agent),
      startedAt: s.started_at,
      lastEventAt: s.last_event_at,
      timestamp: s.started_at,
      duration: s.duration || 0,
      clicks: s.clicks || 0,
      errors: s.errors || 0,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching insight sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
