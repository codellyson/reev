import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const days = Math.min(parseInt(searchParams.get("days") || "7"), 90);
    const sortBy = searchParams.get("sortBy") || "views";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const project = await getUserProject(userId, projectId || undefined);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const validSortColumns: Record<string, string> = {
      views: "total_views",
      sessions: "total_sessions",
      scroll: "avg_scroll",
      errors: "total_errors",
      rage_clicks: "total_rage_clicks",
      lcp: "avg_lcp",
    };

    const sortColumn = validSortColumns[sortBy] || "total_views";

    const [pages, countResult] = await Promise.all([
      query(
        `SELECT
           url,
           SUM(views) as total_views,
           SUM(unique_sessions) as total_sessions,
           ROUND(AVG(avg_scroll_depth), 1) as avg_scroll,
           ROUND(AVG(avg_time_on_page), 0) as avg_time,
           SUM(bounce_count) as total_bounces,
           SUM(rage_click_count) as total_rage_clicks,
           SUM(error_count) as total_errors,
           ROUND(AVG(avg_lcp), 0) as avg_lcp,
           ROUND(AVG(avg_fid), 0) as avg_fid,
           ROUND(AVG(avg_cls)::numeric, 3) as avg_cls
         FROM page_stats
         WHERE project_id = $1 AND date >= CURRENT_DATE - $2::integer
         GROUP BY url
         ORDER BY ${sortColumn} DESC
         LIMIT $3 OFFSET $4`,
        [project.id, days, limit, (page - 1) * limit]
      ),
      queryOne<{ count: string }>(
        `SELECT COUNT(DISTINCT url) as count
         FROM page_stats
         WHERE project_id = $1 AND date >= CURRENT_DATE - $2::integer`,
        [project.id, days]
      ),
    ]);

    const total = parseInt(countResult?.count || "0");

    return NextResponse.json({
      success: true,
      data: {
        data: pages.map((row: any) => ({
          url: row.url,
          views: parseInt(row.total_views || "0"),
          uniqueSessions: parseInt(row.total_sessions || "0"),
          avgScrollDepth: parseFloat(row.avg_scroll || "0"),
          avgTimeOnPage: parseInt(row.avg_time || "0"),
          bounceCount: parseInt(row.total_bounces || "0"),
          rageClickCount: parseInt(row.total_rage_clicks || "0"),
          errorCount: parseInt(row.total_errors || "0"),
          avgLcp: row.avg_lcp ? parseInt(row.avg_lcp) : null,
          avgFid: row.avg_fid ? parseInt(row.avg_fid) : null,
          avgCls: row.avg_cls ? parseFloat(row.avg_cls) : null,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}
