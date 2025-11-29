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

    const [totalResult, avgResult, errorResult, topPagesResult] = await Promise.all([
      queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM sessions WHERE project_id = $1 AND started_at >= $2 AND started_at <= $3`,
        [project.id, todayStart, todayEnd]
      ),
      queryOne<{ avg: string | null }>(
        `SELECT AVG(duration) as avg FROM sessions WHERE project_id = $1 AND started_at >= $2 AND started_at <= $3 AND duration IS NOT NULL`,
        [project.id, todayStart, todayEnd]
      ),
      queryOne<{ sum: string | null }>(
        `SELECT COALESCE(SUM(errors), 0) as sum FROM sessions WHERE project_id = $1 AND started_at >= $2 AND started_at <= $3`,
        [project.id, todayStart, todayEnd]
      ),
      query<{ url: string; count: string }>(
        `SELECT page_url as url, COUNT(*) as count
         FROM sessions
         WHERE project_id = $1 AND started_at >= $2 AND started_at <= $3 AND page_url IS NOT NULL
         GROUP BY page_url
         ORDER BY count DESC
         LIMIT 10`,
        [project.id, todayStart, todayEnd]
      ),
    ]);

    const totalSessions = parseInt(totalResult?.count || "0", 10);
    const avgDuration = avgResult?.avg ? Math.round(parseFloat(avgResult.avg)) : 0;
    const errorCount = parseInt(errorResult?.sum || "0", 10);
    const topPages = topPagesResult.map((row) => ({
      url: row.url,
      count: parseInt(row.count, 10),
    }));

    const bounceRate = totalSessions > 0 ? 0 : 0;

    const stats: Stats = {
      totalSessions,
      avgDuration,
      bounceRate,
      errorCount,
      topPages,
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

