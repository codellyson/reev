"use client";

import { useQuery } from "@tanstack/react-query";
import type { Session } from "@/types/api";

async function fetchSession(sessionId: string): Promise<Session> {
  const response = await fetch(`/api/sessions/${sessionId}`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch session");
  }

  return result.data;
}

export function useSession(sessionId: string | null) {
  const query = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: !!sessionId,
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}

