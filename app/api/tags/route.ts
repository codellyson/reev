import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectIdParam = searchParams.get("projectId");
    
    const project = await getUserProject(userId, projectIdParam || undefined);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

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
      [project.id]
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const projectIdParam = body.projectId;
    
    const project = await getUserProject(userId, projectIdParam || undefined);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const { name, color } = body;

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
      [name, color, project.id]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectIdParam = searchParams.get("projectId");
    
    const project = await getUserProject(userId, projectIdParam || undefined);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const tagId = request.nextUrl.searchParams.get("id");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    await query(`DELETE FROM tags WHERE id = $1 AND project_id = $2`, [tagId, project.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}

