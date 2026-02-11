"use client";

import { useQuery } from "@tanstack/react-query";
import type { PageStat, PaginatedResponse } from "@/types/api";
import { useProjectContext } from "@/app/providers/project-provider";

interface PageFilters {
  days?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

async function fetchPages(
  projectId: string,
  filters: PageFilters
): Promise<PaginatedResponse<PageStat>> {
  const params = new URLSearchParams({ projectId });
  if (filters.days) params.set("days", String(filters.days));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const response = await fetch(`/api/pages?${params}`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch pages");
  }

  return result.data;
}

export function usePages(filters: PageFilters = {}) {
  const { selectedProject } = useProjectContext();

  const query = useQuery({
    queryKey: ["pages", selectedProject?.id, filters],
    queryFn: () => fetchPages(selectedProject!.id, filters),
    enabled: !!selectedProject,
  });

  return {
    data: query.data || null,
    pages: query.data?.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}
