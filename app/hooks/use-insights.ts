"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Insight, PaginatedResponse } from "@/types/api";
import { useProjectContext } from "@/app/providers/project-provider";

interface InsightFilters {
  type?: string;
  severity?: string;
  status?: string;
  page?: number;
  limit?: number;
}

async function fetchInsights(
  projectId: string,
  filters: InsightFilters
): Promise<PaginatedResponse<Insight>> {
  const params = new URLSearchParams({ projectId });
  if (filters.type) params.set("type", filters.type);
  if (filters.severity) params.set("severity", filters.severity);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const response = await fetch(`/api/insights?${params}`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch insights");
  }

  return result.data;
}

export function useInsights(filters: InsightFilters = {}) {
  const { selectedProject } = useProjectContext();

  const query = useQuery({
    queryKey: ["insights", selectedProject?.id, filters],
    queryFn: () => fetchInsights(selectedProject!.id, filters),
    enabled: !!selectedProject,
  });

  return {
    data: query.data || null,
    insights: query.data?.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}

export function useUpdateInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch("/api/insights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update insight");
      }
      return result.data as Insight;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
