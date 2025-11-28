import { Pool, PoolClient, PoolConfig } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error(
      "Database connection not configured. Please set DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD environment variables."
    );
  }

  const poolConfig: PoolConfig = {
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432", 10),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  };

  pool = new Pool(poolConfig);

  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    pool = null;
  });

  return pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  let client: PoolClient | null = null;

  try {
    const pool = getPool();
    client = await pool.connect();
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Connection")) {
      throw new Error(`Database connection error: ${error.message}`);
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  let client: PoolClient | null = null;
  try {
    const pool = getPool();
    client = await pool.connect();
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Error during rollback:", rollbackError);
      }
    }
    if (error instanceof Error && error.message.includes("Connection")) {
      throw new Error(`Database connection error: ${error.message}`);
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
