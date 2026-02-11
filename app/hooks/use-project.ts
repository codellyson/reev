import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Project {
  id: string;
  name: string;
  website_url: string;
}

async function fetchProject(projectId?: string): Promise<Project | null> {
  const url = projectId ? `/api/projects?id=${projectId}` : "/api/projects";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  const data = await response.json();
  if (projectId) {
    return data.data;
  }
  const projects = data.data as Project[];
  return projects.length > 0 ? projects[0] : null;
}

export function useProject(projectId?: string) {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    project: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}

export function useProjects() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      return data.data as Project[];
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    projects: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
  };
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      website_url,
    }: {
      id: string;
      name: string;
      website_url: string;
    }) => {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, website_url }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update project");
      }
      const data = await response.json();
      return data.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}
