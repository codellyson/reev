"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrendData } from "@/types/api";
import { useProjectContext } from "@/app/providers/project-provider";

async function fetchTrend(projectId: string, days: number): Promise<TrendData> {
  const response = await fetch(
    `/api/stats/trend?projectId=${projectId}&days=${days}`
  );
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch trend data");
  }

  return result.data;
}

export function useTrend(days = 7) {
  const { selectedProject } = useProjectContext();

  const query = useQuery({
    queryKey: ["trend", selectedProject?.id, days],
    queryFn: () => fetchTrend(selectedProject!.id, days),
    enabled: !!selectedProject,
  });

  return {
    trend: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}
