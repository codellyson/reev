import { config } from "dotenv";
import { query, closePool } from "./db";

config();

async function migrateV5(): Promise<void> {
  try {
    console.log("Running v5 migration: flow suggestions...");

    // Flow suggestions table — stores manual + auto-discovered navigation suggestions
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

    // Flow config table — per-project widget configuration
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
  } catch (error) {
    console.error("V5 migration failed:", error);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  migrateV5()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateV5 };
