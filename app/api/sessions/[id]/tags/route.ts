import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    const result = await query(
      `SELECT t.* 
      FROM tags t
      INNER JOIN session_tags st ON t.id = st.tag_id
      WHERE st.session_id = $1
      ORDER BY t.name ASC`,
      [sessionId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching session tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch session tags" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    const { tagId } = body;

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    await query(
      `INSERT INTO session_tags (session_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT (session_id, tag_id) DO NOTHING`,
      [sessionId, tagId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding tag to session:", error);
    return NextResponse.json(
      { error: "Failed to add tag to session" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const tagId = request.nextUrl.searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    await query(
      `DELETE FROM session_tags 
      WHERE session_id = $1 AND tag_id = $2`,
      [sessionId, tagId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing tag from session:", error);
    return NextResponse.json(
      { error: "Failed to remove tag from session" },
      { status: 500 }
    );
  }
}

