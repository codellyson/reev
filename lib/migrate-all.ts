import { readFileSync } from "fs";
import { join } from "path";
import { query, closePool } from "./db";

async function runSchema(): Promise<void> {
  const schemaPath = join(process.cwd(), "lib", "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");

  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await query(statement);
  }
  console.log("  Schema applied");
}

async function runV2(): Promise<void> {
  await query(
    `ALTER TABLE insights ADD COLUMN IF NOT EXISTS previous_metric_value NUMERIC`
  );
  await query(
    `ALTER TABLE insights ADD COLUMN IF NOT EXISTS trend TEXT DEFAULT 'new'`
  );
  await query(
    `ALTER TABLE insights ADD COLUMN IF NOT EXISTS suggestion TEXT`
  );
  console.log("  V2 migration applied");
}

async function runV3(): Promise<void> {
  await query(
    `ALTER TABLE feedback ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open'`
  );
  await query(`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS device TEXT`);
  await query(`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS browser TEXT`);
  await query(
    `CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(project_id, status)`
  );
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
  console.log("  V3 migration applied");
}

async function runV4(): Promise<void> {
  await query(
    `ALTER TABLE feedback ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'`
  );
  console.log("  V4 migration applied");
}

async function runV5(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS flow_suggestions (
      id BIGSERIAL PRIMARY KEY,
      project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      source_url_pattern TEXT NOT NULL,
      target_url TEXT NOT NULL,
      target_label TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'manual',
      priority INTEGER NOT NULL DEFAULT 0,
      click_count INTEGER DEFAULT 0,
      dismiss_count INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(project_id, source_url_pattern, target_url)
    )
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_flow_suggestions_project_url
    ON flow_suggestions(project_id, source_url_pattern) WHERE is_active = true
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_flow_suggestions_source
    ON flow_suggestions(project_id, source)
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS flow_config (
      id BIGSERIAL PRIMARY KEY,
      project_id UUID UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      enabled BOOLEAN DEFAULT false,
      display_mode TEXT NOT NULL DEFAULT 'frustration',
      max_suggestions INTEGER DEFAULT 3,
      widget_position TEXT DEFAULT 'bottom-right',
      widget_theme TEXT DEFAULT 'dark',
      auto_discover BOOLEAN DEFAULT true,
      min_transition_count INTEGER DEFAULT 5,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_flow_config_project ON flow_config(project_id)
  `);
  console.log("  V5 migration applied");
}

async function migrateAll(): Promise<void> {
  console.log("Running all migrations...");
  try {
    await runSchema();
    await runV2();
    await runV3();
    await runV4();
    await runV5();
    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await closePool();
  }
}

migrateAll()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
