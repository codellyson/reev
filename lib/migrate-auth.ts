import { config } from "dotenv";
import { query, transaction } from "./db";
import { generateApiKey } from "./api-key-generator";

config();

async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    );
    return result.length > 0 && (result[0] as any).exists;
  } catch {
    return false;
  }
}

async function migrateAuth(): Promise<void> {
  try {
    console.log("Starting auth migration...");

    const usersExists = await tableExists("users");
    const projectsExists = await tableExists("projects");

    if (usersExists && projectsExists) {
      console.log("Auth tables already exist, skipping migration");
      return;
    }

    await transaction(async (client) => {
      if (!usersExists) {
        console.log("Creating users table...");
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) UNIQUE NOT NULL,
            email_verified TIMESTAMPTZ,
            name VARCHAR(255),
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          )
        `);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
        console.log("Users table created");
      }

      if (!projectsExists) {
        console.log("Creating projects table...");
        await client.query(`
          CREATE TABLE IF NOT EXISTS projects (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            api_key VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          )
        `);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_api_key ON projects(api_key)`);
        console.log("Projects table created");
      }

      const sessionsExists = await tableExists("sessions");
      if (sessionsExists) {
        const oldSessions = await client.query(
          `SELECT DISTINCT project_id FROM sessions WHERE project_id IS NOT NULL LIMIT 1`
        );

        if (oldSessions.rows.length > 0) {
          console.log("Found existing sessions, checking if migration needed...");
          
          const projectIdColumn = await client.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'sessions' 
            AND column_name = 'project_id'
          `);

          if (projectIdColumn.rows.length > 0 && projectIdColumn.rows[0].data_type === 'character varying') {
            console.log("Migrating sessions table from VARCHAR to UUID...");
            
            await client.query(`
              ALTER TABLE sessions 
              DROP CONSTRAINT IF EXISTS sessions_project_id_fkey,
              ALTER COLUMN project_id TYPE UUID USING NULL
            `);

            await client.query(`
              ALTER TABLE sessions 
              ADD CONSTRAINT sessions_project_id_fkey 
              FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            `);

            console.log("Sessions table migrated to UUID");
          }
        }
      }

      const tagsExists = await tableExists("tags");
      if (tagsExists) {
        const oldTags = await client.query(
          `SELECT DISTINCT project_id FROM tags WHERE project_id IS NOT NULL LIMIT 1`
        );

        if (oldTags.rows.length > 0) {
          console.log("Found existing tags, checking if migration needed...");
          
          const projectIdColumn = await client.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'tags' 
            AND column_name = 'project_id'
          `);

          if (projectIdColumn.rows.length > 0 && projectIdColumn.rows[0].data_type === 'character varying') {
            console.log("Migrating tags table from VARCHAR to UUID...");
            
            await client.query(`
              ALTER TABLE tags 
              DROP CONSTRAINT IF EXISTS tags_project_id_fkey,
              ALTER COLUMN project_id TYPE UUID USING NULL
            `);

            await client.query(`
              ALTER TABLE tags 
              ADD CONSTRAINT tags_project_id_fkey 
              FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            `);

            console.log("Tags table migrated to UUID");
          }
        }
      }
    });

    console.log("Auth migration completed successfully");
  } catch (error) {
    console.error("Auth migration failed:", error);
    throw error;
  }
}

if (require.main === module) {
  migrateAuth()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateAuth };

