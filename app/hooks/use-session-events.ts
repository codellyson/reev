"use client";

import { useQuery } from "@tanstack/react-query";
import type { PageEvent } from "@/types/api";

async function fetchSessionEvents(sessionId: string): Promise<PageEvent[]> {
  const response = await fetch(`/api/sessions/${sessionId}/events`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch events");
  }

  return result.data.events || [];
}

export function useSessionEvents(sessionId: string | null) {
  const query = useQuery({
    queryKey: ["session-events", sessionId],
    queryFn: () => fetchSessionEvents(sessionId!),
    enabled: !!sessionId,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}
