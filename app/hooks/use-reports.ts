"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProjectContext } from "@/app/providers/project-provider";
import type { Report } from "@/types/api";

interface ReportFilters {
  status?: "open" | "resolved" | "all";
  issueType?: string;
  search?: string;
  pageUrl?: string;
  limit?: number;
  offset?: number;
}

interface ReportSummary {
  type: string;
  count: number;
}

interface ReportsResponse {
  reports: Report[];
  total: number;
  summary: ReportSummary[];
}

async function fetchReports(
  projectId: string,
  filters: ReportFilters
): Promise<ReportsResponse> {
  const params = new URLSearchParams({ projectId });
  if (filters.status) params.set("status", filters.status);
  if (filters.issueType) params.set("issueType", filters.issueType);
  if (filters.search) params.set("search", filters.search);
  if (filters.pageUrl) params.set("pageUrl", filters.pageUrl);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));

  const response = await fetch(`/api/reports?${params}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch reports");
  }

  return result;
}

export function useReports(filters: ReportFilters = {}) {
  const { selectedProject } = useProjectContext();

  const query_ = useQuery({
    queryKey: ["reports", selectedProject?.id, filters],
    queryFn: () => fetchReports(selectedProject!.id, filters),
    enabled: !!selectedProject,
  });

  return {
    reports: query_.data?.reports || [],
    total: query_.data?.total || 0,
    summary: query_.data?.summary || [],
    loading: query_.isLoading,
    error: query_.error?.message || null,
  };
}

export function useResolveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "open" | "resolved" }) => {
      const response = await fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update report");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["patterns"] });
    },
  });
}
