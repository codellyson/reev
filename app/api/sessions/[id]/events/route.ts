import { NextRequest, NextResponse } from "next/server";
import type { SessionEvent } from "@/types/api";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await fetchSessionEvents(id);

    return NextResponse.json({ success: true, data: { events } });
  } catch (error) {
    console.error("Error fetching session events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session events" },
      { status: 500 }
    );
  }
}

async function fetchSessionEvents(sessionId: string): Promise<SessionEvent[]> {
  const rows = await query<{
    id: string;
    session_id: string;
    event_type: number;
    data: any;
    timestamp: number;
  }>(
    `SELECT id, session_id, event_type, data, timestamp
     FROM events
     WHERE session_id = $1
     ORDER BY timestamp ASC`,
    [sessionId]
  );

  return rows.map((row) => ({
    id: row.id.toString(),
    sessionId: row.session_id,
    eventType: row.event_type,
    data: row.data,
    timestamp: row.timestamp,
  }));
}

