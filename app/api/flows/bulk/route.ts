import { NextRequest, NextResponse } from "next/server";
import { queryOne, transaction } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

const MAX_BATCH_SIZE = 50;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const { projectId, suggestions } = body;

    if (!projectId || !Array.isArray(suggestions) || suggestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "projectId and suggestions array required" },
        { status: 400 }
      );
    }

    if (suggestions.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${MAX_BATCH_SIZE} suggestions per batch`,
        },
        { status: 400 }
      );
    }

    // Validate all entries have required fields
    for (const s of suggestions) {
      if (!s.sourceUrlPattern || !s.targetUrl || !s.targetLabel) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Each suggestion requires sourceUrlPattern, targetUrl, and targetLabel",
          },
          { status: 400 }
        );
      }
    }

    // Verify project ownership
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

    const result = await transaction(async (client) => {
      let created = 0;
      let updated = 0;

      for (const s of suggestions) {
        const res = await client.query(
          `INSERT INTO flow_suggestions
             (project_id, source_url_pattern, target_url, target_label, source, priority)
           VALUES ($1, $2, $3, $4, 'sitemap', $5)
           ON CONFLICT (project_id, source_url_pattern, target_url) DO UPDATE
             SET target_label = $4, is_active = true, updated_at = NOW()
           RETURNING (xmax = 0) AS is_insert`,
          [
            projectId,
            s.sourceUrlPattern,
            s.targetUrl,
            s.targetLabel,
            s.priority || 10,
          ]
        );

        if (res.rows[0]?.is_insert) {
          created++;
        } else {
          updated++;
        }
      }

      return { created, updated };
    });

    return NextResponse.json({
      success: true,
      created: result.created,
      updated: result.updated,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error bulk creating flow suggestions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create suggestions" },
      { status: 500 }
    );
  }
}
