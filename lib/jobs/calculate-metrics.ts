import { query, transaction } from "../db";

export async function calculateSessionMetrics(): Promise<void> {
  try {
    const sessions = await query<{
      id: string;
      duration: number | null;
      clicks: number;
      errors: number;
    }>(
      `SELECT id, duration, clicks, errors
       FROM sessions
       WHERE duration IS NULL 
          OR (duration = 0 AND last_event_at > started_at)
          OR clicks = 0
       ORDER BY started_at DESC
       LIMIT 100`
    );

    for (const session of sessions) {
      await transaction(async (client) => {
        const events = await client.query<{
          event_type: number;
          timestamp: number;
          data: any;
        }>(
          `SELECT event_type, timestamp, data
           FROM events
           WHERE session_id = $1
           ORDER BY timestamp ASC`,
          [session.id]
        );

        if (events.rows.length === 0) {
          return;
        }

        const timestamps = events.rows.map((e) => e.timestamp);
        const minTimestamp = Math.min(...timestamps);
        const maxTimestamp = Math.max(...timestamps);
        const duration = Math.floor((maxTimestamp - minTimestamp) / 1000);

        // Count clicks: IncrementalSnapshot (type 3) with source = MouseInteraction (2) and type = Click (2)
        let clicks = 0;
        // Count errors: Custom events (type 5) with error indicators, or Log events (type 11) with level = error
        let errors = 0;

        for (const event of events.rows) {
          // Check for clicks: event type 3 (IncrementalSnapshot) with data.source = 2 (MouseInteraction) and data.type = 2 (Click)
          if (event.event_type === 3 && event.data?.source === 2 && event.data?.type === 2) {
            clicks++;
          }
          // Check for errors: Custom events (type 5) or Log events (type 11) with error level
          if (event.event_type === 5 && (event.data?.tag === "error" || event.data?.payload?.error)) {
            errors++;
          } else if (event.event_type === 11 && event.data?.level === "error") {
            errors++;
          }
        }

        await client.query(
          `UPDATE sessions
           SET duration = $1, clicks = $2, errors = $3, last_event_at = NOW()
           WHERE id = $4`,
          [duration, clicks, errors, session.id]
        );
      });
    }

    console.log(`Calculated metrics for ${sessions.length} sessions`);
  } catch (error) {
    console.error("Error calculating session metrics:", error);
    throw error;
  }
}

if (require.main === module) {
  calculateSessionMetrics()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

