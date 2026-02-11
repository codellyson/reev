import { config } from "dotenv";
import { query, closePool } from "./db";

config();

async function migrateV2(): Promise<void> {
  try {
    console.log("Running v2 migration: issues-first redesign...");

    await query(
      `ALTER TABLE insights ADD COLUMN IF NOT EXISTS previous_metric_value NUMERIC`
    );
    await query(
      `ALTER TABLE insights ADD COLUMN IF NOT EXISTS trend TEXT DEFAULT 'new'`
    );
    await query(
      `ALTER TABLE insights ADD COLUMN IF NOT EXISTS suggestion TEXT`
    );

    console.log("V2 migration completed successfully");
  } catch (error) {
    console.error("V2 migration failed:", error);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  migrateV2()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
