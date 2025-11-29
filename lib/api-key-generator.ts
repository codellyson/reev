import { query, queryOne } from "./db";

const API_KEY_PREFIX = "reev_";
const API_KEY_LENGTH = 32;

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateApiKey(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const randomPart = generateRandomString(API_KEY_LENGTH);
    const apiKey = `${API_KEY_PREFIX}${randomPart}`;

    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM projects WHERE api_key = $1`,
      [apiKey]
    );

    if (!existing) {
      return apiKey;
    }

    attempts++;
  }

  throw new Error("Failed to generate unique API key after multiple attempts");
}

