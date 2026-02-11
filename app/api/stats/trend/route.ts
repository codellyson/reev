import { NextRequest, NextResponse } from "next/server";
import type { TrendData } from "@/types/api";
import { query } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const days = Math.min(parseInt(searchParams.get("days") || "7"), 90);

    const project = await getUserProject(userId, projectId || undefined);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const rows = await query<{
      date: string;
      pageviews: string;
      sessions: string;
      errors: string;
    }>(
      `SELECT
         d.date::text,
         COALESCE(SUM(ps.views), 0) as pageviews,
         COALESCE(SUM(ps.unique_sessions), 0) as sessions,
         COALESCE(SUM(ps.error_count), 0) as errors
       FROM generate_series(
         CURRENT_DATE - $2::integer,
         CURRENT_DATE,
         '1 day'::interval
       ) d(date)
       LEFT JOIN page_stats ps ON ps.date = d.date AND ps.project_id = $1
       GROUP BY d.date
       ORDER BY d.date`,
      [project.id, days - 1]
    );

    const trendData: TrendData = {
      dates: rows.map((r) => r.date),
      pageviews: rows.map((r) => parseInt(r.pageviews)),
      sessions: rows.map((r) => parseInt(r.sessions)),
      errors: rows.map((r) => parseInt(r.errors)),
    };

    return NextResponse.json({ success: true, data: trendData });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching trend:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trend data" },
      { status: 500 }
    );
  }
}
