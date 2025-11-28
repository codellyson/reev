import { NextResponse } from "next/server";
import type { Stats } from "@/types/api";
import { query, queryOne } from "@/lib/db";

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalResult, avgResult, errorResult, topPagesResult] = await Promise.all([
      queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM sessions WHERE started_at >= $1 AND started_at <= $2`,
        [todayStart, todayEnd]
      ),
      queryOne<{ avg: string | null }>(
        `SELECT AVG(duration) as avg FROM sessions WHERE started_at >= $1 AND started_at <= $2 AND duration IS NOT NULL`,
        [todayStart, todayEnd]
      ),
      queryOne<{ sum: string | null }>(
        `SELECT COALESCE(SUM(errors), 0) as sum FROM sessions WHERE started_at >= $1 AND started_at <= $2`,
        [todayStart, todayEnd]
      ),
      query<{ url: string; count: string }>(
        `SELECT page_url as url, COUNT(*) as count
         FROM sessions
         WHERE started_at >= $1 AND started_at <= $2 AND page_url IS NOT NULL
         GROUP BY page_url
         ORDER BY count DESC
         LIMIT 10`,
        [todayStart, todayEnd]
      ),
    ]);

    const totalSessions = parseInt(totalResult?.count || "0", 10);
    const avgDuration = avgResult?.avg ? Math.round(parseFloat(avgResult.avg)) : 0;
    const errorCount = parseInt(errorResult?.sum || "0", 10);
    const topPages = topPagesResult.map((row) => ({
      url: row.url,
      count: parseInt(row.count, 10),
    }));

    const bounceRate = totalSessions > 0 ? 0 : 0;

    const stats: Stats = {
      totalSessions,
      avgDuration,
      bounceRate,
      errorCount,
      topPages,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

