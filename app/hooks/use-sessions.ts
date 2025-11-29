"use client";

import { useQuery } from "@tanstack/react-query";
import type { Session, SessionQueryParams, PaginatedResponse } from "@/types/api";
import { useProjectContext } from "@/app/providers/project-provider";

function buildQueryString(params?: SessionQueryParams, projectId?: string): string {
  const queryParams = new URLSearchParams();
  if (projectId) queryParams.set("projectId", projectId);
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params?.order) queryParams.set("order", params.order);
  if (params?.dateRange) {
    queryParams.set("dateRangeStart", params.dateRange.start);
    queryParams.set("dateRangeEnd", params.dateRange.end);
  }
  if (params?.devices) queryParams.set("devices", params.devices.join(","));
  if (params?.pageUrl) queryParams.set("pageUrl", params.pageUrl);
  if (params?.minDuration) queryParams.set("minDuration", params.minDuration.toString());
  if (params?.maxDuration) queryParams.set("maxDuration", params.maxDuration.toString());
  if (params?.hasErrors !== undefined) queryParams.set("hasErrors", params.hasErrors.toString());
  return queryParams.toString();
}

async function fetchSessions(params?: SessionQueryParams, projectId?: string): Promise<PaginatedResponse<Session>> {
  if (!projectId) {
    throw new Error("No project selected");
  }
  const queryString = buildQueryString(params, projectId);
  const response = await fetch(`/api/sessions?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch sessions");
  }

  return result;
}

export function useSessions(params?: SessionQueryParams) {
  const { selectedProject } = useProjectContext();
  
  const query = useQuery({
    queryKey: ["sessions", params, selectedProject?.id],
    queryFn: () => fetchSessions(params, selectedProject?.id),
    enabled: !!selectedProject,
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
}

