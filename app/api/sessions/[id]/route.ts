import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@/types/api";
import { queryOne } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

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
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectIdParam = searchParams.get("projectId");
    
    const project = await getUserProject(userId, projectIdParam || undefined);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const { id } = await params;
    const session = await fetchSessionById(id, project.id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

async function fetchSessionById(id: string, projectId: string): Promise<Session | null> {
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
     WHERE id = $1 AND project_id = $2`,
    [id, projectId]
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

