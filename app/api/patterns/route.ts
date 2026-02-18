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
    const status = searchParams.get("status") || "open";
    const issueType = searchParams.get("issueType");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

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

    let whereClause = "p.project_id = $1";
    const params: any[] = [projectId];
    let paramIndex = 2;

    if (status && status !== "all") {
      whereClause += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (issueType) {
      whereClause += ` AND p.issue_type = $${paramIndex}`;
      params.push(issueType);
      paramIndex++;
    }

    const countParams = [...params];
    params.push(limit, offset);

    const patterns = await query(
      `SELECT
        p.id,
        p.project_id,
        p.issue_type,
        p.page_url_pattern,
        p.selector_pattern,
        p.title,
        p.report_count,
        p.first_seen_at,
        p.last_seen_at,
        p.status
      FROM patterns p
      WHERE ${whereClause}
      ORDER BY p.report_count DESC, p.last_seen_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    // For each pattern, get the 3 most recent messages
    const enrichedPatterns = await Promise.all(
      patterns.map(async (pattern: any) => {
        const messages = await query<{ message: string; device: string | null }>(
          `SELECT message, device FROM feedback
           WHERE project_id = $1
             AND issue_type = $2
             AND page_url ILIKE $3
             AND message IS NOT NULL
             AND message != ''
           ORDER BY created_at DESC
           LIMIT 3`,
          [projectId, pattern.issue_type, `%${pattern.page_url_pattern}%`]
        );

        return {
          ...pattern,
          recent_messages: messages.map(
            (m) => m.message + (m.device ? ` — ${m.device}` : "")
          ),
        };
      })
    );

    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM patterns p WHERE ${whereClause}`,
      countParams
    );

    return NextResponse.json({
      patterns: enrichedPatterns,
      total: parseInt(countResult?.count || "0", 10),
    });
  } catch (error) {
    console.error("Error fetching patterns:", error);
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
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

    const pattern = await queryOne<{ id: number; project_id: string; issue_type: string; page_url_pattern: string }>(
      `SELECT p.id, p.project_id, p.issue_type, p.page_url_pattern
       FROM patterns p
       JOIN projects pr ON p.project_id = pr.id
       WHERE p.id = $1 AND pr.user_id = $2`,
      [id, session.user.id]
    );

    if (!pattern) {
      return NextResponse.json(
        { error: "Pattern not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update pattern status
    await query(
      `UPDATE patterns SET status = $1 WHERE id = $2`,
      [status, id]
    );

    // Bulk-update linked reports
    await query(
      `UPDATE feedback SET status = $1
       WHERE project_id = $2
         AND issue_type = $3
         AND page_url ILIKE $4`,
      [status, pattern.project_id, pattern.issue_type, `%${pattern.page_url_pattern}%`]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating pattern:", error);
    return NextResponse.json(
      { error: "Failed to update pattern" },
      { status: 500 }
    );
  }
}
