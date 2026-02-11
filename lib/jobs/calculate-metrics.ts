import { query, transaction } from "../db";

export async function calculateMetrics(): Promise<void> {
  try {
    await calculateSessionMetrics();
    await aggregatePageStats();
    await computeInsights();
    console.log("All metrics calculated successfully");
  } catch (error) {
    console.error("Error calculating metrics:", error);
    throw error;
  }
}

async function calculateSessionMetrics(): Promise<void> {
  const sessions = await query<{ id: string }>(
    `SELECT id FROM sessions
     WHERE duration IS NULL
        OR (duration = 0 AND last_event_at > started_at)
     ORDER BY started_at DESC
     LIMIT 200`
  );

  for (const session of sessions) {
    await transaction(async (client) => {
      const stats = await client.query(
        `SELECT
           COUNT(*) FILTER (WHERE event_type = 'click') as clicks,
           COUNT(*) FILTER (WHERE event_type = 'error') as errors,
           MIN(timestamp) as min_ts,
           MAX(timestamp) as max_ts
         FROM page_events
         WHERE session_id = $1`,
        [session.id]
      );

      const row = stats.rows[0];
      if (!row || !row.min_ts) return;

      const duration = Math.floor((row.max_ts - row.min_ts) / 1000);

      await client.query(
        `UPDATE sessions
         SET duration = $1, clicks = $2, errors = $3, last_event_at = NOW()
         WHERE id = $4`,
        [duration, parseInt(row.clicks), parseInt(row.errors), session.id]
      );
    });
  }

  console.log(`Updated metrics for ${sessions.length} sessions`);
}

async function aggregatePageStats(): Promise<void> {
  await query(
    `INSERT INTO page_stats (project_id, url, date, views, unique_sessions,
       avg_scroll_depth, avg_time_on_page, bounce_count, rage_click_count,
       error_count, avg_lcp, avg_fid, avg_cls)
     SELECT
       s.project_id,
       pe.url,
       CURRENT_DATE,
       COUNT(*) FILTER (WHERE pe.event_type = 'pageview'),
       COUNT(DISTINCT pe.session_id),
       COALESCE(AVG((pe.data->>'maxDepth')::numeric) FILTER (WHERE pe.event_type = 'scroll'), 0),
       COALESCE(AVG((pe.data->>'timeOnPage')::numeric / 1000) FILTER (WHERE pe.event_type = 'page_leave'), 0),
       COUNT(DISTINCT pe.session_id) FILTER (
         WHERE pe.event_type = 'page_leave' AND (pe.data->>'timeOnPage')::numeric < 10000
       ),
       COUNT(*) FILTER (WHERE pe.event_type = 'click' AND (pe.data->>'isRage')::boolean = true),
       COUNT(*) FILTER (WHERE pe.event_type = 'error'),
       AVG((pe.data->>'value')::numeric) FILTER (WHERE pe.event_type = 'vitals' AND pe.data->>'metric' = 'lcp'),
       AVG((pe.data->>'value')::numeric) FILTER (WHERE pe.event_type = 'vitals' AND pe.data->>'metric' = 'fid'),
       AVG((pe.data->>'value')::numeric) FILTER (WHERE pe.event_type = 'vitals' AND pe.data->>'metric' = 'cls')
     FROM page_events pe
     JOIN sessions s ON s.id = pe.session_id
     WHERE pe.url IS NOT NULL
       AND pe.created_at >= CURRENT_DATE
     GROUP BY s.project_id, pe.url
     ON CONFLICT (project_id, url, date) DO UPDATE SET
       views = EXCLUDED.views,
       unique_sessions = EXCLUDED.unique_sessions,
       avg_scroll_depth = EXCLUDED.avg_scroll_depth,
       avg_time_on_page = EXCLUDED.avg_time_on_page,
       bounce_count = EXCLUDED.bounce_count,
       rage_click_count = EXCLUDED.rage_click_count,
       error_count = EXCLUDED.error_count,
       avg_lcp = EXCLUDED.avg_lcp,
       avg_fid = EXCLUDED.avg_fid,
       avg_cls = EXCLUDED.avg_cls`
  );

  console.log("Page stats aggregated");
}

async function computeInsights(): Promise<void> {
  const projects = await query<{ id: string }>(
    `SELECT id FROM projects`
  );

  for (const project of projects) {
    await detectRageClicks(project.id);
    await detectScrollDropoff(project.id);
    await detectFormAbandonment(project.id);
    await detectSlowPages(project.id);
    await detectErrorSpikes(project.id);
  }

  console.log("Insights computed");
}

async function detectRageClicks(projectId: string): Promise<void> {
  const rageClicks = await query<{
    url: string;
    selector: string;
    count: string;
  }>(
    `SELECT pe.url, pe.data->>'selector' as selector, COUNT(*) as count
     FROM page_events pe
     JOIN sessions s ON s.id = pe.session_id
     WHERE s.project_id = $1
       AND pe.event_type = 'click'
       AND (pe.data->>'isRage')::boolean = true
       AND pe.created_at >= CURRENT_DATE - 1
     GROUP BY pe.url, pe.data->>'selector'
     HAVING COUNT(*) >= 3
     ORDER BY count DESC
     LIMIT 20`,
    [projectId]
  );

  for (const rc of rageClicks) {
    const count = parseInt(rc.count);
    const severity =
      count >= 20 ? "critical" : count >= 10 ? "high" : count >= 5 ? "medium" : "low";

    await upsertInsight(projectId, {
      type: "rage_click",
      severity,
      title: `Rage clicks on "${rc.selector}"`,
      description: `Users are rage-clicking ${count} times on ${rc.selector} at ${rc.url}`,
      url: rc.url,
      metricValue: count,
      metadata: { selector: rc.selector },
    });
  }
}

async function detectScrollDropoff(projectId: string): Promise<void> {
  const dropoffs = await query<{
    url: string;
    avg_depth: string;
    view_count: string;
  }>(
    `SELECT url, ROUND(AVG(avg_scroll_depth), 1) as avg_depth, SUM(views) as view_count
     FROM page_stats
     WHERE project_id = $1
       AND date >= CURRENT_DATE - 7
       AND views >= 5
     GROUP BY url
     HAVING AVG(avg_scroll_depth) < 30
     ORDER BY SUM(views) DESC
     LIMIT 10`,
    [projectId]
  );

  for (const d of dropoffs) {
    const depth = parseFloat(d.avg_depth);
    const severity = depth < 15 ? "high" : "medium";

    await upsertInsight(projectId, {
      type: "scroll_dropoff",
      severity,
      title: `Low scroll depth on page`,
      description: `Users only scroll ${depth}% of the page on average (${d.view_count} views)`,
      url: d.url,
      metricValue: depth,
      metadata: { viewCount: parseInt(d.view_count) },
    });
  }
}

async function detectFormAbandonment(projectId: string): Promise<void> {
  const abandonments = await query<{
    url: string;
    form_id: string;
    starts: string;
    submits: string;
  }>(
    `SELECT
       pe.url,
       pe.data->>'formId' as form_id,
       COUNT(*) FILTER (WHERE pe.data->>'action' = 'field_focus') as starts,
       COUNT(*) FILTER (WHERE pe.data->>'action' = 'submit') as submits
     FROM page_events pe
     JOIN sessions s ON s.id = pe.session_id
     WHERE s.project_id = $1
       AND pe.event_type = 'form'
       AND pe.created_at >= CURRENT_DATE - 7
     GROUP BY pe.url, pe.data->>'formId'
     HAVING COUNT(*) FILTER (WHERE pe.data->>'action' = 'field_focus') >= 5
       AND COUNT(*) FILTER (WHERE pe.data->>'action' = 'submit') <
           COUNT(*) FILTER (WHERE pe.data->>'action' = 'field_focus') * 0.5
     ORDER BY COUNT(*) FILTER (WHERE pe.data->>'action' = 'field_focus') DESC
     LIMIT 10`,
    [projectId]
  );

  for (const a of abandonments) {
    const starts = parseInt(a.starts);
    const submits = parseInt(a.submits);
    const rate = Math.round((1 - submits / starts) * 100);
    const severity = rate >= 80 ? "high" : "medium";

    await upsertInsight(projectId, {
      type: "form_abandonment",
      severity,
      title: `High form abandonment on "${a.form_id}"`,
      description: `${rate}% of users abandon this form (${starts} started, ${submits} submitted)`,
      url: a.url,
      metricValue: rate,
      metadata: { formId: a.form_id, starts, submits },
    });
  }
}

async function detectSlowPages(projectId: string): Promise<void> {
  const slowPages = await query<{
    url: string;
    avg_lcp: string;
    avg_cls: string;
    view_count: string;
  }>(
    `SELECT url, ROUND(AVG(avg_lcp), 0) as avg_lcp, ROUND(AVG(avg_cls)::numeric, 3) as avg_cls,
            SUM(views) as view_count
     FROM page_stats
     WHERE project_id = $1
       AND date >= CURRENT_DATE - 7
       AND (avg_lcp IS NOT NULL OR avg_cls IS NOT NULL)
     GROUP BY url
     HAVING AVG(avg_lcp) > 2500 OR AVG(avg_cls) > 0.25
     ORDER BY AVG(avg_lcp) DESC NULLS LAST
     LIMIT 10`,
    [projectId]
  );

  for (const p of slowPages) {
    const lcp = p.avg_lcp ? parseInt(p.avg_lcp) : null;
    const cls = p.avg_cls ? parseFloat(p.avg_cls) : null;
    const severity = (lcp && lcp > 4000) || (cls && cls > 0.5) ? "high" : "medium";

    let description = "";
    if (lcp && lcp > 2500) description += `LCP: ${(lcp / 1000).toFixed(1)}s. `;
    if (cls && cls > 0.25) description += `CLS: ${cls}. `;
    description += `(${p.view_count} views)`;

    await upsertInsight(projectId, {
      type: "slow_page",
      severity,
      title: `Slow page performance`,
      description: description.trim(),
      url: p.url,
      metricValue: lcp || 0,
      metadata: { lcp, cls, viewCount: parseInt(p.view_count) },
    });
  }
}

async function detectErrorSpikes(projectId: string): Promise<void> {
  const errorPages = await query<{
    url: string;
    error_count: string;
    view_count: string;
  }>(
    `SELECT url, SUM(error_count) as error_count, SUM(views) as view_count
     FROM page_stats
     WHERE project_id = $1
       AND date >= CURRENT_DATE - 3
       AND error_count > 0
     GROUP BY url
     HAVING SUM(error_count) >= 3
     ORDER BY SUM(error_count) DESC
     LIMIT 10`,
    [projectId]
  );

  for (const e of errorPages) {
    const errors = parseInt(e.error_count);
    const views = parseInt(e.view_count);
    const errorRate = views > 0 ? Math.round((errors / views) * 100) : 0;
    const severity = errorRate >= 50 ? "critical" : errorRate >= 20 ? "high" : "medium";

    await upsertInsight(projectId, {
      type: "error_spike",
      severity,
      title: `JS errors detected`,
      description: `${errors} errors across ${views} page views (${errorRate}% error rate)`,
      url: e.url,
      metricValue: errors,
      metadata: { errorRate, viewCount: views },
    });
  }
}

async function upsertInsight(
  projectId: string,
  insight: {
    type: string;
    severity: string;
    title: string;
    description: string;
    url: string | null;
    metricValue: number;
    metadata: Record<string, any>;
  }
): Promise<void> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM insights
     WHERE project_id = $1 AND type = $2 AND url IS NOT DISTINCT FROM $3 AND status != 'resolved'
     LIMIT 1`,
    [projectId, insight.type, insight.url]
  );

  if (existing.length > 0) {
    await query(
      `UPDATE insights SET
         severity = $1, title = $2, description = $3, metric_value = $4,
         metadata = $5, last_seen_at = NOW(), occurrences = occurrences + 1,
         updated_at = NOW()
       WHERE id = $6`,
      [
        insight.severity,
        insight.title,
        insight.description,
        insight.metricValue,
        JSON.stringify(insight.metadata),
        existing[0].id,
      ]
    );
  } else {
    await query(
      `INSERT INTO insights (project_id, type, severity, title, description, url,
         metric_value, metadata, first_seen_at, last_seen_at, occurrences)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), 1)`,
      [
        projectId,
        insight.type,
        insight.severity,
        insight.title,
        insight.description,
        insight.url,
        insight.metricValue,
        JSON.stringify(insight.metadata),
      ]
    );
  }
}

if (require.main === module) {
  calculateMetrics()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
