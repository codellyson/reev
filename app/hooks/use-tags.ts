"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProjectContext } from "@/app/providers/project-provider";

export interface Tag {
  id: string;
  name: string;
  color: string;
  session_count?: number;
  created_at?: string;
}

export function useTags() {
  const { selectedProject } = useProjectContext();
  
  return useQuery({
    queryKey: ["tags", selectedProject?.id],
    queryFn: async () => {
      if (!selectedProject) throw new Error("No project selected");
      const response = await fetch(`/api/tags?projectId=${selectedProject.id}`);
      if (!response.ok) throw new Error("Failed to fetch tags");
      return response.json() as Promise<Tag[]>;
    },
    enabled: !!selectedProject,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  const { selectedProject } = useProjectContext();

  return useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      if (!selectedProject) throw new Error("No project selected");
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, projectId: selectedProject.id }),
      });
      if (!response.ok) throw new Error("Failed to create tag");
      return response.json();
    },
    onSuccess: () => {
      if (selectedProject) {
        queryClient.invalidateQueries({ queryKey: ["tags", selectedProject.id] });
      }
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  const { selectedProject } = useProjectContext();

  return useMutation({
    mutationFn: async (tagId: string) => {
      if (!selectedProject) throw new Error("No project selected");
      const response = await fetch(`/api/tags?id=${tagId}&projectId=${selectedProject.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tag");
      return response.json();
    },
    onSuccess: () => {
      if (selectedProject) {
        queryClient.invalidateQueries({ queryKey: ["tags", selectedProject.id] });
      }
    },
  });
}

export function useSessionTags(sessionId: string) {
  return useQuery({
    queryKey: ["session-tags", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${sessionId}/tags`);
      if (!response.ok) throw new Error("Failed to fetch session tags");
      return response.json() as Promise<Tag[]>;
    },
  });
}

export function useAddSessionTag(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const response = await fetch(`/api/sessions/${sessionId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagId }),
      });
      if (!response.ok) throw new Error("Failed to add tag to session");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-tags", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useRemoveSessionTag(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const response = await fetch(`/api/sessions/${sessionId}/tags?tagId=${tagId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove tag from session");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-tags", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

