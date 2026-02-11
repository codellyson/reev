"use client";

import { useQuery } from "@tanstack/react-query";
import type { InsightSummary } from "@/types/api";
import { useProjectContext } from "@/app/providers/project-provider";

async function fetchInsightSummary(projectId: string): Promise<InsightSummary> {
  const response = await fetch(`/api/insights/summary?projectId=${projectId}`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch summary");
  }

  return result.data;
}

export function useInsightSummary() {
  const { selectedProject } = useProjectContext();

  const q = useQuery({
    queryKey: ["insight-summary", selectedProject?.id],
    queryFn: () => fetchInsightSummary(selectedProject!.id),
    enabled: !!selectedProject,
  });

  return {
    summary: q.data || null,
    loading: q.isLoading,
    error: q.error?.message || null,
  };
}
