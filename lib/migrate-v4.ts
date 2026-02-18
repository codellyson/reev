import { config } from "dotenv";
import { query, closePool } from "./db";

config();

async function migrateV4(): Promise<void> {
  try {
    console.log("Running v4 migration: enriched report context...");

    // Single JSONB column for all enriched context (screenshot, DOM snapshot,
    // console errors, breadcrumbs, time on page)
    await query(
      `ALTER TABLE feedback ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'`
    );

    console.log("V4 migration completed successfully");
  } catch (error) {
    console.error("V4 migration failed:", error);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  migrateV4()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
