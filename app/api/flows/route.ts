import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);

    const projectId = request.nextUrl.searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const project = await queryOne(
      `SELECT id FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const source = request.nextUrl.searchParams.get("source");

    let whereClause = "project_id = $1";
    const params: any[] = [projectId];
    let idx = 2;

    if (source) {
      whereClause += ` AND source = $${idx}`;
      params.push(source);
      idx++;
    }

    const suggestions = await query(
      `SELECT * FROM flow_suggestions WHERE ${whereClause}
       ORDER BY source_url_pattern, priority DESC, click_count DESC`,
      params
    );

    const config = await queryOne(
      `SELECT * FROM flow_config WHERE project_id = $1`,
      [projectId]
    );

    return NextResponse.json({ suggestions, config });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching flows:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch flows" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const { projectId, sourceUrlPattern, targetUrl, targetLabel, priority } =
      body;

    if (!projectId || !sourceUrlPattern || !targetUrl || !targetLabel) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify ownership
    const project = await queryOne(
      `SELECT id FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const suggestion = await queryOne(
      `INSERT INTO flow_suggestions
         (project_id, source_url_pattern, target_url, target_label, source, priority)
       VALUES ($1, $2, $3, $4, 'manual', $5)
       ON CONFLICT (project_id, source_url_pattern, target_url) DO UPDATE
         SET target_label = $4, priority = $5, is_active = true, updated_at = NOW()
       RETURNING *`,
      [projectId, sourceUrlPattern, targetUrl, targetLabel, priority || 10]
    );

    return NextResponse.json({ success: true, data: suggestion });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating flow suggestion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create suggestion" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const { id, targetLabel, priority, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id required" },
        { status: 400 }
      );
    }

    // Verify ownership through project
    const existing = await queryOne(
      `SELECT fs.id FROM flow_suggestions fs
       JOIN projects p ON fs.project_id = p.id
       WHERE fs.id = $1 AND p.user_id = $2`,
      [id, userId]
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const updates: string[] = ["updated_at = NOW()"];
    const params: any[] = [];
    let idx = 1;

    if (targetLabel !== undefined) {
      updates.push(`target_label = $${idx}`);
      params.push(targetLabel);
      idx++;
    }
    if (priority !== undefined) {
      updates.push(`priority = $${idx}`);
      params.push(priority);
      idx++;
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${idx}`);
      params.push(isActive);
      idx++;
    }

    params.push(id);
    const result = await queryOne(
      `UPDATE flow_suggestions SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`,
      params
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating flow suggestion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update suggestion" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id required" },
        { status: 400 }
      );
    }

    const existing = await queryOne(
      `SELECT fs.id FROM flow_suggestions fs
       JOIN projects p ON fs.project_id = p.id
       WHERE fs.id = $1 AND p.user_id = $2`,
      [id, userId]
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    await query(`DELETE FROM flow_suggestions WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting flow suggestion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete suggestion" },
      { status: 500 }
    );
  }
}
