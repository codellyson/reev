import { config } from "dotenv";
import { query, closePool } from "./db";

config();

async function migrateV3(): Promise<void> {
  try {
    console.log("Running v3 migration: reports-first redesign...");

    // Add status and device context to feedback table (now "reports")
    await query(
      `ALTER TABLE feedback ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open'`
    );
    await query(
      `ALTER TABLE feedback ADD COLUMN IF NOT EXISTS device TEXT`
    );
    await query(
      `ALTER TABLE feedback ADD COLUMN IF NOT EXISTS browser TEXT`
    );

    // Index for filtering reports by status
    await query(
      `CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(project_id, status)`
    );

    // Patterns table — auto-grouped recurring frustration reports
    await query(`
      CREATE TABLE IF NOT EXISTS patterns (
        id BIGSERIAL PRIMARY KEY,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        issue_type TEXT NOT NULL,
        page_url_pattern TEXT NOT NULL,
        selector_pattern TEXT,
        title TEXT NOT NULL,
        report_count INTEGER DEFAULT 0,
        first_seen_at TIMESTAMPTZ NOT NULL,
        last_seen_at TIMESTAMPTZ NOT NULL,
        status TEXT DEFAULT 'open',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(project_id, issue_type, page_url_pattern)
      )
    `);

    await query(
      `CREATE INDEX IF NOT EXISTS idx_patterns_project ON patterns(project_id, status, last_seen_at DESC)`
    );

    console.log("V3 migration completed successfully");
  } catch (error) {
    console.error("V3 migration failed:", error);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  migrateV3()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
