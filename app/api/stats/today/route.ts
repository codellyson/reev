import { NextRequest, NextResponse } from "next/server";
import type { Stats } from "@/types/api";
import { query, queryOne } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectIdParam = searchParams.get("projectId");

    const project = await getUserProject(userId, projectIdParam || undefined);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [pageviewResult, sessionResult, scrollResult, errorResult, topPagesResult] =
      await Promise.all([
        queryOne<{ count: string }>(
          `SELECT COUNT(*) as count FROM page_events
           WHERE session_id IN (SELECT id FROM sessions WHERE project_id = $1)
             AND event_type = 'pageview'
             AND created_at >= $2 AND created_at <= $3`,
          [project.id, todayStart, todayEnd]
        ),
        queryOne<{ count: string }>(
          `SELECT COUNT(DISTINCT session_id) as count FROM page_events
           WHERE session_id IN (SELECT id FROM sessions WHERE project_id = $1)
             AND created_at >= $2 AND created_at <= $3`,
          [project.id, todayStart, todayEnd]
        ),
        queryOne<{ avg: string | null }>(
          `SELECT AVG((data->>'maxDepth')::numeric) as avg FROM page_events
           WHERE session_id IN (SELECT id FROM sessions WHERE project_id = $1)
             AND event_type = 'scroll'
             AND created_at >= $2 AND created_at <= $3`,
          [project.id, todayStart, todayEnd]
        ),
        queryOne<{ count: string }>(
          `SELECT COUNT(*) as count FROM page_events
           WHERE session_id IN (SELECT id FROM sessions WHERE project_id = $1)
             AND event_type = 'error'
             AND created_at >= $2 AND created_at <= $3`,
          [project.id, todayStart, todayEnd]
        ),
        query<{ url: string; count: string }>(
          `SELECT url, COUNT(*) as count FROM page_events
           WHERE session_id IN (SELECT id FROM sessions WHERE project_id = $1)
             AND event_type = 'pageview'
             AND url IS NOT NULL
             AND created_at >= $2 AND created_at <= $3
           GROUP BY url
           ORDER BY count DESC
           LIMIT 10`,
          [project.id, todayStart, todayEnd]
        ),
      ]);

    const stats: Stats = {
      totalPageviews: parseInt(pageviewResult?.count || "0"),
      uniqueSessions: parseInt(sessionResult?.count || "0"),
      avgScrollDepth: scrollResult?.avg ? Math.round(parseFloat(scrollResult.avg)) : 0,
      errorCount: parseInt(errorResult?.count || "0"),
      topPages: topPagesResult.map((row) => ({
        url: row.url,
        count: parseInt(row.count),
      })),
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
