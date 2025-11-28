"use client";

import { useQuery } from "@tanstack/react-query";
import type { Stats } from "@/types/api";

async function fetchStats(): Promise<Stats> {
  const response = await fetch("/api/stats/today");
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch stats");
  }

  return result.data;
}

export function useStats() {
  const query = useQuery({
    queryKey: ["stats", "today"],
    queryFn: fetchStats,
  });

  return {
    stats: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}


