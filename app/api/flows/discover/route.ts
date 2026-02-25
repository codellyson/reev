import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import { generateLabel } from "@/lib/sitemap";

function generatePathLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments.map((s) => generateLabel(s)).join(" > ");
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const { projectId } = body;

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

    // Get min transition count from config
    const config = await queryOne<{ min_transition_count: number }>(
      `SELECT min_transition_count FROM flow_config WHERE project_id = $1`,
      [projectId]
    );
    const minCount = config?.min_transition_count || 5;

    // Find common page transitions from pageview events
    const transitions = await query<{
      from_path: string;
      to_path: string;
      transition_count: string;
    }>(`
      WITH page_visits AS (
        SELECT
          pe.session_id,
          pe.url,
          pe.timestamp,
          ROW_NUMBER() OVER (PARTITION BY pe.session_id ORDER BY pe.timestamp) as seq
        FROM page_events pe
        JOIN sessions s ON pe.session_id = s.id
        WHERE pe.event_type = 'pageview'
          AND s.project_id = $1
          AND pe.created_at > NOW() - INTERVAL '30 days'
      ),
      transitions AS (
        SELECT
          a.url as from_url,
          b.url as to_url
        FROM page_visits a
        JOIN page_visits b
          ON a.session_id = b.session_id
          AND b.seq = a.seq + 1
        WHERE a.url IS NOT NULL AND b.url IS NOT NULL
          AND a.url != b.url
      )
      SELECT
        from_url as from_path,
        to_url as to_path,
        COUNT(*) as transition_count
      FROM transitions
      GROUP BY from_url, to_url
      HAVING COUNT(*) >= $2
      ORDER BY transition_count DESC
      LIMIT 100
    `, [projectId, minCount]);

    let created = 0;
    let updated = 0;

    for (const t of transitions) {
      let fromPath: string;
      let toPath: string;
      try {
        fromPath = new URL(t.from_path).pathname;
      } catch {
        fromPath = t.from_path;
      }
      try {
        toPath = new URL(t.to_path).pathname;
      } catch {
        toPath = t.to_path;
      }

      const label = generatePathLabel(toPath);
      const count = parseInt(t.transition_count, 10);

      const existing = await queryOne<{ id: number; source: string }>(
        `SELECT id, source FROM flow_suggestions
         WHERE project_id = $1 AND source_url_pattern = $2 AND target_url = $3`,
        [projectId, fromPath, toPath]
      );

      if (existing) {
        // Only update auto-discovered suggestions, don't overwrite manual ones
        if (existing.source === "auto") {
          await query(
            `UPDATE flow_suggestions SET click_count = $1, updated_at = NOW()
             WHERE id = $2`,
            [count, existing.id]
          );
          updated++;
        }
      } else {
        await query(
          `INSERT INTO flow_suggestions
             (project_id, source_url_pattern, target_url, target_label, source, priority)
           VALUES ($1, $2, $3, $4, 'auto', 0)
           ON CONFLICT (project_id, source_url_pattern, target_url) DO NOTHING`,
          [projectId, fromPath, toPath, label]
        );
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      total: transitions.length,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error discovering flows:", error);
    return NextResponse.json(
      { success: false, error: "Failed to discover flows" },
      { status: 500 }
    );
  }
}
