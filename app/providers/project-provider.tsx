"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useProjects } from "@/app/hooks/use-project";

interface Project {
  id: string;
  name: string;
  website_url: string;
}

interface ProjectContextType {
  selectedProject: Project | null;
  projects: Project[];
  loading: boolean;
  setSelectedProject: (project: Project | null) => void;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECT_STORAGE_KEY = "reev_selected_project_id";

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { projects, loading, error } = useProjects();
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);

  const setSelectedProject = useCallback((project: Project | null) => {
    setSelectedProjectState(project);
    if (project) {
      localStorage.setItem(PROJECT_STORAGE_KEY, project.id);
    } else {
      localStorage.removeItem(PROJECT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      const storedId = localStorage.getItem(PROJECT_STORAGE_KEY);
      const projectToSelect = storedId
        ? projects.find((p) => p.id === storedId) || projects[0]
        : projects[0];
      setSelectedProject(projectToSelect);
    } else if (projects.length === 0 && selectedProject) {
      setSelectedProject(null);
    } else if (selectedProject && !projects.find((p) => p.id === selectedProject.id)) {
      const storedId = localStorage.getItem(PROJECT_STORAGE_KEY);
      const projectToSelect = storedId
        ? projects.find((p) => p.id === storedId) || (projects.length > 0 ? projects[0] : null)
        : (projects.length > 0 ? projects[0] : null);
      setSelectedProject(projectToSelect);
    }
  }, [projects, selectedProject, setSelectedProject]);

  const refreshProjects = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        projects,
        loading,
        setSelectedProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}

