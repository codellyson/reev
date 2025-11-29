"use client";

import { useQuery } from "@tanstack/react-query";
import type { Stats } from "@/types/api";
import { useProjectContext } from "@/app/providers/project-provider";

async function fetchStats(projectId: string): Promise<Stats> {
  const response = await fetch(`/api/stats/today?projectId=${projectId}`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch stats");
  }

  return result.data;
}

export function useStats() {
  const { selectedProject } = useProjectContext();
  
  const query = useQuery({
    queryKey: ["stats", "today", selectedProject?.id],
    queryFn: () => fetchStats(selectedProject!.id),
    enabled: !!selectedProject,
  });

  return {
    stats: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}


