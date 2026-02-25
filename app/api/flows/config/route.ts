import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
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

    const config = await queryOne(
      `SELECT * FROM flow_config WHERE project_id = $1`,
      [projectId]
    );

    return NextResponse.json({
      success: true,
      data: config || {
        enabled: false,
        display_mode: "frustration",
        max_suggestions: 3,
        widget_position: "bottom-right",
        widget_theme: "dark",
        auto_discover: true,
        min_transition_count: 5,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching flow config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const {
      projectId,
      enabled,
      displayMode,
      maxSuggestions,
      widgetPosition,
      widgetTheme,
      autoDiscover,
      minTransitionCount,
    } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId required" },
        { status: 400 }
      );
    }

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

    const config = await queryOne(
      `INSERT INTO flow_config
         (project_id, enabled, display_mode, max_suggestions, widget_position, widget_theme, auto_discover, min_transition_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (project_id) DO UPDATE SET
         enabled = $2,
         display_mode = $3,
         max_suggestions = $4,
         widget_position = $5,
         widget_theme = $6,
         auto_discover = $7,
         min_transition_count = $8,
         updated_at = NOW()
       RETURNING *`,
      [
        projectId,
        enabled ?? false,
        displayMode || "frustration",
        maxSuggestions ?? 3,
        widgetPosition || "bottom-right",
        widgetTheme || "dark",
        autoDiscover ?? true,
        minTransitionCount ?? 5,
      ]
    );

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating flow config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update config" },
      { status: 500 }
    );
  }
}
