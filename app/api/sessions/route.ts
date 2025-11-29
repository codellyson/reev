import { NextRequest, NextResponse } from "next/server";
import type { SessionQueryParams, PaginatedResponse, Session } from "@/types/api";
import { query, queryOne } from "@/lib/db";
import { requireAuth, getUserProject } from "@/lib/auth-helpers";

function detectDevice(userAgent: string | null): "desktop" | "mobile" | "tablet" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") && !ua.includes("tablet")) return "mobile";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  return "desktop";
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectIdParam = searchParams.get("projectId");
    
    const project = await getUserProject(userId, projectIdParam || undefined);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") || "started_at";
    const order = searchParams.get("order") || "desc";

    const dateRangeStart = searchParams.get("dateRangeStart");
    const dateRangeEnd = searchParams.get("dateRangeEnd");
    const devices = searchParams.get("devices")?.split(",").filter(Boolean);
    const pageUrl = searchParams.get("pageUrl");
    const minDuration = searchParams.get("minDuration");
    const maxDuration = searchParams.get("maxDuration");
    const hasErrors = searchParams.get("hasErrors");

    const queryParams: SessionQueryParams = {
      page,
      limit,
      sortBy,
      order: order as "asc" | "desc",
      ...(dateRangeStart && dateRangeEnd && {
        dateRange: { start: dateRangeStart, end: dateRangeEnd },
      }),
      ...(devices && devices.length > 0 && { devices }),
      ...(pageUrl && { pageUrl }),
      ...(minDuration && { minDuration: parseInt(minDuration) }),
      ...(maxDuration && { maxDuration: parseInt(maxDuration) }),
      ...(hasErrors && { hasErrors: hasErrors === "true" }),
    };

    const response = await fetchSessions(queryParams, project.id);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

async function fetchSessions(
  params: SessionQueryParams,
  projectId: string
): Promise<PaginatedResponse<Session>> {
  const { page = 1, limit = 50, sortBy = "started_at", order = "desc" } = params;
  const offset = (page - 1) * limit;

  const conditions: string[] = [`project_id = $1`];
  const values: any[] = [projectId];
  let paramIndex = 2;

  if (params.dateRange?.start && params.dateRange?.end) {
    conditions.push(`started_at >= $${paramIndex} AND started_at <= $${paramIndex + 1}`);
    values.push(params.dateRange.start, params.dateRange.end);
    paramIndex += 2;
  }

  if (params.pageUrl) {
    conditions.push(`page_url ILIKE $${paramIndex}`);
    values.push(`%${params.pageUrl}%`);
    paramIndex += 1;
  }

  if (params.minDuration !== undefined) {
    conditions.push(`duration >= $${paramIndex}`);
    values.push(params.minDuration);
    paramIndex += 1;
  }

  if (params.maxDuration !== undefined) {
    conditions.push(`duration <= $${paramIndex}`);
    values.push(params.maxDuration);
    paramIndex += 1;
  }

  if (params.hasErrors !== undefined) {
    if (params.hasErrors) {
      conditions.push(`errors > 0`);
    } else {
      conditions.push(`(errors = 0 OR errors IS NULL)`);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const validSortColumns = ["started_at", "last_event_at", "duration", "clicks", "errors"];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "started_at";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  const countResult = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM sessions ${whereClause}`,
    values
  );
  const total = parseInt(countResult?.count || "0", 10);

  const sessions = await query<{
    id: string;
    project_id: string;
    page_url: string | null;
    user_agent: string | null;
    started_at: Date;
    last_event_at: Date | null;
    duration: number | null;
    clicks: number;
    errors: number;
  }>(
    `SELECT id, project_id, page_url, user_agent, started_at, last_event_at, duration, clicks, errors
     FROM sessions
     ${whereClause}
     ORDER BY ${sortColumn} ${sortOrder}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limit, offset]
  );

  let filteredSessions = sessions;

  if (params.devices && params.devices.length > 0) {
    filteredSessions = sessions.filter((s) => {
      const device = detectDevice(s.user_agent);
      return params.devices?.includes(device);
    });
  }

  const mappedSessions: Session[] = filteredSessions.map((s) => ({
    id: s.id,
    projectId: s.project_id,
    duration: s.duration || 0,
    pageUrl: s.page_url || "",
    timestamp: s.started_at,
    device: detectDevice(s.user_agent),
    userAgent: s.user_agent || "",
    clicks: s.clicks,
    errors: s.errors,
    startedAt: s.started_at,
    lastEventAt: s.last_event_at || s.started_at,
  }));

  return {
    data: mappedSessions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

