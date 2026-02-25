import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=60",
  };
}

export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { allowed } = rateLimit(`flows:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: corsHeaders() }
      );
    }

    const projectId = request.nextUrl.searchParams.get("projectId");
    const pageUrl = request.nextUrl.searchParams.get("url");

    if (!projectId || !pageUrl) {
      return NextResponse.json(
        { error: "projectId and url are required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate project exists
    const project = await queryOne<{ id: string }>(
      `SELECT id FROM projects WHERE id = $1`,
      [projectId]
    );
    if (!project) {
      return NextResponse.json(
        { error: "Invalid project" },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Fetch flow config
    const config = await queryOne<{
      enabled: boolean;
      display_mode: string;
      max_suggestions: number;
      widget_position: string;
      widget_theme: string;
    }>(
      `SELECT enabled, display_mode, max_suggestions, widget_position, widget_theme
       FROM flow_config WHERE project_id = $1`,
      [projectId]
    );

    if (!config || !config.enabled) {
      return NextResponse.json(
        { enabled: false, suggestions: [] },
        { headers: corsHeaders() }
      );
    }

    // Normalize URL to pathname for relevance sorting
    let pagePath: string;
    try {
      pagePath = new URL(pageUrl).pathname.replace(/\/$/, "") || "/";
    } catch {
      pagePath = pageUrl;
    }

    // Fetch all active suggestions for the project, sorted by relevance
    // to the current page path:
    //   1. Exact source match first
    //   2. Same base path (e.g. /docs/* when on /docs/api-reference)
    //   3. Everything else
    // This way the widget always has the full set and groups them as a tree
    const suggestions = await query<{
      id: number;
      target_url: string;
      target_label: string;
    }>(
      `SELECT id, target_url, target_label
       FROM flow_suggestions
       WHERE project_id = $1
         AND is_active = true
         AND target_url != $2
       ORDER BY
         CASE
           WHEN source_url_pattern = $2 THEN 0
           WHEN $2 LIKE source_url_pattern || '/%' THEN 1
           WHEN source_url_pattern LIKE split_part($2, '/', 2) || '%' THEN 2
           ELSE 3
         END,
         priority DESC,
         click_count DESC`,
      [projectId, pagePath]
    );

    return NextResponse.json(
      {
        enabled: true,
        displayMode: config.display_mode,
        position: config.widget_position,
        theme: config.widget_theme,
        currentPath: pagePath,
        suggestions: suggestions.map((s) => ({
          id: s.id,
          url: s.target_url,
          label: s.target_label,
        })),
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}
