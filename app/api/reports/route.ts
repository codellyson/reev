import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const issueType = searchParams.get("issueType");
    const status = searchParams.get("status") || "open";
    const search = searchParams.get("search");
    const pageUrl = searchParams.get("pageUrl");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const project = await queryOne<{ id: string }>(
      `SELECT id FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, session.user.id]
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    let whereClause = "f.project_id = $1";
    const params: any[] = [projectId];
    let paramIndex = 2;

    if (status && status !== "all") {
      whereClause += ` AND f.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (issueType) {
      whereClause += ` AND f.issue_type = $${paramIndex}`;
      params.push(issueType);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (f.message ILIKE $${paramIndex} OR f.page_url ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (pageUrl) {
      whereClause += ` AND f.page_url ILIKE $${paramIndex}`;
      params.push(`%${pageUrl}%`);
      paramIndex++;
    }

    const countParams = [...params];

    params.push(limit, offset);

    const reports = await query(
      `SELECT
        f.id,
        f.session_id,
        f.project_id,
        f.issue_type,
        f.issue_severity,
        f.issue_selector,
        f.message,
        f.page_url,
        f.status,
        f.device,
        f.browser,
        f.context,
        f.created_at,
        s.user_agent
      FROM feedback f
      JOIN sessions s ON f.session_id = s.id
      WHERE ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM feedback f WHERE ${whereClause}`,
      countParams
    );

    const summary = await query<{ issue_type: string; count: string }>(
      `SELECT issue_type, COUNT(*) as count
       FROM feedback
       WHERE project_id = $1 AND status = 'open'
       GROUP BY issue_type
       ORDER BY count DESC`,
      [projectId]
    );

    return NextResponse.json({
      reports,
      total: parseInt(countResult?.count || "0", 10),
      summary: summary.map((s) => ({
        type: s.issue_type,
        count: parseInt(s.count, 10),
      })),
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !["open", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid id or status" },
        { status: 400 }
      );
    }

    // Verify ownership through project
    const report = await queryOne<{ id: number }>(
      `SELECT f.id FROM feedback f
       JOIN projects p ON f.project_id = p.id
       WHERE f.id = $1 AND p.user_id = $2`,
      [id, session.user.id]
    );

    if (!report) {
      return NextResponse.json(
        { error: "Report not found or unauthorized" },
        { status: 404 }
      );
    }

    await query(
      `UPDATE feedback SET status = $1 WHERE id = $2`,
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
