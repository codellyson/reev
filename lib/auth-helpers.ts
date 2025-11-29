import { getServerSession as getNextAuthSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "./auth";
import { queryOne, query } from "./db";

export async function getServerSession() {
  return await getNextAuthSession(authOptions);
}

export async function requireAuth(
  request: NextRequest
): Promise<{ userId: string; email: string }> {
  const session = await getNextAuthSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return {
    userId: (session.user as any).id,
    email: session.user.email as string,
  };
}

export async function getUserProjects(userId: string) {
  const projects = await query<{
    id: string;
    name: string;
    website_url: string;
  }>(
    `SELECT id, name, website_url FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  return projects;
}

export async function getUserProject(userId: string, projectId?: string) {
  if (projectId) {
    const project = await queryOne<{
      id: string;
      name: string;
      website_url: string;
      user_id: string;
    }>(
      `SELECT id, name, website_url, user_id FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );
    return project;
  }

  const project = await queryOne<{
    id: string;
    name: string;
    website_url: string;
  }>(
    `SELECT id, name, website_url FROM projects WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );

  return project;
}
