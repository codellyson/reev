"use client";

import { useQuery } from "@tanstack/react-query";
import type { Session } from "@/types/api";

async function fetchInsightSessions(insightId: string): Promise<Session[]> {
  const response = await fetch(`/api/insights/${insightId}/sessions`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch sessions");
  }

  return result.data;
}

export function useInsightSessions(insightId: string | null) {
  const q = useQuery({
    queryKey: ["insight-sessions", insightId],
    queryFn: () => fetchInsightSessions(insightId!),
    enabled: !!insightId,
  });

  return {
    sessions: q.data || [],
    loading: q.isLoading,
    error: q.error?.message || null,
  };
}
