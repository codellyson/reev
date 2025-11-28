import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@/types/api";
import { queryOne } from "@/lib/db";

function detectDevice(userAgent: string | null): "desktop" | "mobile" | "tablet" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") && !ua.includes("tablet")) return "mobile";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  return "desktop";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await fetchSessionById(id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

async function fetchSessionById(id: string): Promise<Session | null> {
  const row = await queryOne<{
    id: string;
    project_id: string;
    page_url: string | null;
    user_agent: string | null;
    started_at: Date;
    last_event_at: Date | null;
    duration: number | null;
    clicks: number;
    errors: number;
  }>(
    `SELECT id, project_id, page_url, user_agent, started_at, last_event_at, duration, clicks, errors
     FROM sessions
     WHERE id = $1`,
    [id]
  );

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    projectId: row.project_id,
    duration: row.duration || 0,
    pageUrl: row.page_url || "",
    timestamp: row.started_at,
    device: detectDevice(row.user_agent),
    userAgent: row.user_agent || "",
    clicks: row.clicks,
    errors: row.errors,
    startedAt: row.started_at,
    lastEventAt: row.last_event_at || row.started_at,
  };
}

