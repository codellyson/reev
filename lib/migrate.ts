import { readFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { query } from "./db";

config();

export async function migrate(): Promise<void> {
  try {
    const schemaPath = join(process.cwd(), "lib", "schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await query(statement);
    }

    console.log("Database migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

