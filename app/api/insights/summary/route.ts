import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    const project = await getUserProject(userId, projectId || undefined);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const rows = await query<{
      severity: string;
      trend: string;
      count: string;
    }>(
      `SELECT severity, COALESCE(trend, 'new') as trend, COUNT(*) as count
       FROM insights
       WHERE project_id = $1 AND status = 'active'
       GROUP BY severity, trend`,
      [project.id]
    );

    const bySeverity: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    const trending: Record<string, number> = { worsening: 0, improving: 0, stable: 0, new: 0 };
    let total = 0;

    for (const row of rows) {
      const count = parseInt(row.count);
      total += count;
      if (row.severity in bySeverity) bySeverity[row.severity] += count;
      if (row.trend in trending) trending[row.trend] += count;
    }

    return NextResponse.json({
      success: true,
      data: { total, bySeverity, trending },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching insight summary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
