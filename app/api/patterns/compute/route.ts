import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const ISSUE_TYPE_LABELS: Record<string, string> = {
  rage_click: "Rage clicks",
  dead_link: "Dead links",
  broken_image: "Broken images",
  form_frustration: "Form frustration",
};

function normalizePageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url;
  }
}

function generateTitle(issueType: string, pagePath: string): string {
  const label = ISSUE_TYPE_LABELS[issueType] || issueType;
  return `${label} on ${pagePath}`;
}

export async function POST(request: NextRequest) {
  try {
    // Find groups of feedback with 2+ reports on the same page + issue type
    const groups = await query<{
      project_id: string;
      issue_type: string;
      page_url: string;
      report_count: string;
      first_seen: string;
      last_seen: string;
    }>(
      `SELECT
        project_id,
        issue_type,
        page_url,
        COUNT(*) as report_count,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_seen
      FROM feedback
      WHERE page_url IS NOT NULL AND page_url != ''
      GROUP BY project_id, issue_type, page_url
      HAVING COUNT(*) >= 2`
    );

    let created = 0;
    let updated = 0;

    for (const group of groups) {
      const pagePath = normalizePageUrl(group.page_url);
      const title = generateTitle(group.issue_type, pagePath);
      const reportCount = parseInt(group.report_count, 10);

      const existing = await query<{ id: number }>(
        `SELECT id FROM patterns
         WHERE project_id = $1 AND issue_type = $2 AND page_url_pattern = $3`,
        [group.project_id, group.issue_type, pagePath]
      );

      if (existing.length > 0) {
        await query(
          `UPDATE patterns
           SET report_count = $1, last_seen_at = $2, title = $3
           WHERE id = $4 AND status != 'resolved'`,
          [reportCount, group.last_seen, title, existing[0].id]
        );
        updated++;
      } else {
        await query(
          `INSERT INTO patterns (project_id, issue_type, page_url_pattern, title, report_count, first_seen_at, last_seen_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (project_id, issue_type, page_url_pattern) DO UPDATE
           SET report_count = $5, last_seen_at = $7, title = $4`,
          [group.project_id, group.issue_type, pagePath, title, reportCount, group.first_seen, group.last_seen]
        );
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      total: groups.length,
    });
  } catch (error) {
    console.error("Error computing patterns:", error);
    return NextResponse.json(
      { error: "Failed to compute patterns" },
      { status: 500 }
    );
  }
}
