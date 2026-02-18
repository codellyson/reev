"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProjectContext } from "@/app/providers/project-provider";
import type { Pattern } from "@/types/api";

interface PatternFilters {
  status?: "open" | "resolved" | "all";
  issueType?: string;
  limit?: number;
  offset?: number;
}

interface PatternsResponse {
  patterns: Pattern[];
  total: number;
}

async function fetchPatterns(
  projectId: string,
  filters: PatternFilters
): Promise<PatternsResponse> {
  const params = new URLSearchParams({ projectId });
  if (filters.status) params.set("status", filters.status);
  if (filters.issueType) params.set("issueType", filters.issueType);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));

  const response = await fetch(`/api/patterns?${params}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch patterns");
  }

  return result;
}

export function usePatterns(filters: PatternFilters = {}) {
  const { selectedProject } = useProjectContext();

  const query_ = useQuery({
    queryKey: ["patterns", selectedProject?.id, filters],
    queryFn: () => fetchPatterns(selectedProject!.id, filters),
    enabled: !!selectedProject,
  });

  return {
    patterns: query_.data?.patterns || [],
    total: query_.data?.total || 0,
    loading: query_.isLoading,
    error: query_.error?.message || null,
  };
}

export function useUpdatePattern() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "open" | "resolved" }) => {
      const response = await fetch("/api/patterns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update pattern");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patterns"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
