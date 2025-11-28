import { NextRequest, NextResponse } from "next/server";
import { transaction, query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, projectId, events } = body;

    console.log("Received events:", { sessionId, projectId, eventCount: events?.length });

    if (!sessionId || !projectId || !events || !Array.isArray(events)) {
      console.error("Missing required fields:", { sessionId: !!sessionId, projectId: !!projectId, events: !!events });
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (events.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    const userAgent = request.headers.get("user-agent") || null;
    const pageUrl = extractPageUrl(events);

    await processEvents(sessionId, projectId, events, pageUrl, userAgent);

    console.log("Events processed successfully for session:", sessionId);

    return new NextResponse(null, { 
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error processing events:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error details:", errorMessage);
    return NextResponse.json(
      { success: false, error: `Failed to process events: ${errorMessage}` },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function extractPageUrl(events: any[]): string | null {
  for (const event of events) {
    if (event.type === 4 && event.data?.href) {
      return event.data.href;
    }
    if (event.data?.url) {
      return event.data.url;
    }
  }
  return null;
}

async function processEvents(
  sessionId: string,
  projectId: string,
  events: any[],
  pageUrl: string | null,
  userAgent: string | null
) {
  console.log("Processing events:", { sessionId, projectId, eventCount: events.length, pageUrl, userAgent });
  
  try {
    await transaction(async (client) => {
      console.log("Transaction started, checking for existing session:", sessionId);
      
      const existingSession = await client.query(
        `SELECT id FROM sessions WHERE id = $1`,
        [sessionId]
      );

      console.log("Existing session check result:", existingSession.rows.length);

      if (existingSession.rows.length === 0) {
        console.log("Creating new session");
        await client.query(
          `INSERT INTO sessions (id, project_id, page_url, user_agent, started_at, last_event_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [sessionId, projectId, pageUrl, userAgent]
        );
        console.log("Session created successfully");
      } else {
        console.log("Updating existing session");
        await client.query(
          `UPDATE sessions 
           SET last_event_at = NOW(),
               page_url = COALESCE($3, page_url),
               user_agent = COALESCE($4, user_agent)
           WHERE id = $1`,
          [sessionId, projectId, pageUrl, userAgent]
        );
        console.log("Session updated successfully");
      }

      if (events.length > 0) {
        console.log("Inserting events:", events.length);
        const values: any[] = [];
        const placeholders: string[] = [];
        let paramIndex = 1;

        for (const event of events) {
          placeholders.push(
            `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`
          );
          values.push(
            sessionId,
            event.type,
            JSON.stringify(event.data || {}),
            event.timestamp || 0
          );
          paramIndex += 4;
        }

        await client.query(
          `INSERT INTO events (session_id, event_type, data, timestamp)
           VALUES ${placeholders.join(", ")}`,
          values
        );
        console.log("Events inserted successfully");
      } else {
        console.log("No events to insert");
      }
    });
    console.log("Transaction completed successfully");
  } catch (error) {
    console.error("Error in processEvents:", error);
    throw error;
  }
}

