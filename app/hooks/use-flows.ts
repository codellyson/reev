"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProjectContext } from "@/app/providers/project-provider";
import type { FlowSuggestion, FlowConfig, SitemapData } from "@/types/api";

interface FlowFilters {
  source?: "manual" | "auto" | "sitemap";
}

interface FlowsResponse {
  suggestions: FlowSuggestion[];
  config: FlowConfig | null;
}

async function fetchFlows(
  projectId: string,
  filters: FlowFilters
): Promise<FlowsResponse> {
  const params = new URLSearchParams({ projectId });
  if (filters.source) params.set("source", filters.source);

  const response = await fetch(`/api/flows?${params}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch flows");
  }

  return result;
}

export function useFlows(filters: FlowFilters = {}) {
  const { selectedProject } = useProjectContext();

  const query_ = useQuery({
    queryKey: ["flows", selectedProject?.id, filters],
    queryFn: () => fetchFlows(selectedProject!.id, filters),
    enabled: !!selectedProject,
  });

  return {
    suggestions: query_.data?.suggestions || [],
    config: query_.data?.config || null,
    loading: query_.isLoading,
    error: query_.error?.message || null,
  };
}

export function useCreateFlowSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      sourceUrlPattern: string;
      targetUrl: string;
      targetLabel: string;
      priority?: number;
    }) => {
      const response = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to create suggestion");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
}

export function useUpdateFlowSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: number;
      targetLabel?: string;
      priority?: number;
      isActive?: boolean;
    }) => {
      const response = await fetch("/api/flows", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update suggestion");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
}

export function useDeleteFlowSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/flows?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete suggestion");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
}

export function useUpdateFlowConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      enabled?: boolean;
      displayMode?: string;
      maxSuggestions?: number;
      widgetPosition?: string;
      widgetTheme?: string;
      autoDiscover?: boolean;
      minTransitionCount?: number;
    }) => {
      const response = await fetch("/api/flows/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update config");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
}

export function useDiscoverFlows() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch("/api/flows/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to discover flows");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
}

export function useSitemap() {
  const { selectedProject } = useProjectContext();

  return useQuery<SitemapData>({
    queryKey: ["sitemap", selectedProject?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/flows/sitemap?projectId=${selectedProject!.id}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch sitemap");
      }

      return result.data;
    },
    enabled: false,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useCreateBulkFlowSuggestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      suggestions: Array<{
        sourceUrlPattern: string;
        targetUrl: string;
        targetLabel: string;
        priority?: number;
      }>;
    }) => {
      const response = await fetch("/api/flows/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to create suggestions");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
}
