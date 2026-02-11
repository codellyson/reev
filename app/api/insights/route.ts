import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const project = await getUserProject(userId, projectId || undefined);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const conditions = ["project_id = $1"];
    const params: any[] = [project.id];
    let paramIndex = 2;

    if (type) {
      conditions.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }
    if (severity) {
      conditions.push(`severity = $${paramIndex}`);
      params.push(severity);
      paramIndex++;
    }
    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    const where = conditions.join(" AND ");

    const [insights, countResult] = await Promise.all([
      query(
        `SELECT id, project_id, type, severity, title, description, url,
                metric_value, metadata, first_seen_at, last_seen_at,
                occurrences, status, created_at
         FROM insights
         WHERE ${where}
         ORDER BY
           CASE severity
             WHEN 'critical' THEN 0
             WHEN 'high' THEN 1
             WHEN 'medium' THEN 2
             WHEN 'low' THEN 3
           END,
           occurrences DESC,
           last_seen_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, (page - 1) * limit]
      ),
      queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM insights WHERE ${where}`,
        params
      ),
    ]);

    const total = parseInt(countResult?.count || "0");

    return NextResponse.json({
      success: true,
      data: {
        data: insights.map(mapInsight),
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
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !["active", "acknowledged", "resolved"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid id or status" },
        { status: 400 }
      );
    }

    // Verify user owns the project that owns this insight
    const insight = await queryOne<{ project_id: string }>(
      `SELECT i.project_id FROM insights i
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

    const updated = await queryOne(
      `UPDATE insights SET status = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, project_id, type, severity, title, description, url,
                 metric_value, metadata, first_seen_at, last_seen_at,
                 occurrences, status`,
      [status, id]
    );

    return NextResponse.json({ success: true, data: mapInsight(updated!) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating insight:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update insight" },
      { status: 500 }
    );
  }
}

function mapInsight(row: any) {
  return {
    id: row.id,
    projectId: row.project_id,
    type: row.type,
    severity: row.severity,
    title: row.title,
    description: row.description,
    url: row.url,
    metricValue: row.metric_value ? parseFloat(row.metric_value) : null,
    metadata: row.metadata,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    occurrences: row.occurrences,
    status: row.status,
  };
}
