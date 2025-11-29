import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId") || "default";

    const result = await query(
      `SELECT 
        t.id, 
        t.name, 
        t.color, 
        t.created_at,
        COUNT(st.session_id) as session_count
      FROM tags t
      LEFT JOIN session_tags st ON t.id = st.tag_id
      WHERE t.project_id = $1
      GROUP BY t.id
      ORDER BY t.name ASC`,
      [projectId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, projectId = "default" } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: "Name and color are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO tags (name, color, project_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (name, project_id) DO UPDATE
      SET color = $2
      RETURNING *`,
      [name, color, projectId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tagId = request.nextUrl.searchParams.get("id");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    await query(`DELETE FROM tags WHERE id = $1`, [tagId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}

