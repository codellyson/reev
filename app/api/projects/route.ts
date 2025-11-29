import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getUserProjects, getUserProject } from "@/lib/auth-helpers";
import { query, queryOne } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("id");

    if (projectId) {
      const project = await getUserProject(userId, projectId);
      if (!project) {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: {
          id: project.id,
          name: project.name,
          website_url: project.website_url,
        },
      });
    }

    const projects = await getUserProjects(userId);
    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const { name, website_url } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    if (!website_url || !website_url.trim()) {
      return NextResponse.json(
        { success: false, error: "Website URL is required" },
        { status: 400 }
      );
    }

    let normalizedUrl = website_url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const project = await queryOne<{
      id: string;
      name: string;
      website_url: string;
    }>(
      `INSERT INTO projects (user_id, name, website_url) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, website_url`,
      [userId, name.trim(), normalizedUrl]
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Failed to create project" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: project.id,
        name: project.name,
        website_url: project.website_url,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}

