"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Check, Settings } from "lucide-react";
import { useProjectContext } from "@/app/providers/project-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ProjectSwitcher() {
  const { selectedProject, projects, setSelectedProject } = useProjectContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!selectedProject && projects.length === 0) {
    return (
      <Link
        href="/projects/new"
        className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors inline-flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Project
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm font-medium text-zinc-100 hover:bg-zinc-900 transition-colors inline-flex items-center gap-2 max-w-[200px]"
        aria-label="Switch project"
      >
        <span className="truncate">{selectedProject?.name || "Select Project"}</span>
        <ChevronDown className={cn("h-4 w-4 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 z-50 max-h-96 overflow-auto">
          <div className="p-2">
            {projects.length > 0 ? (
              <>
                <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                  Projects
                </div>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsOpen(false);
                      router.refresh();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-2 text-sm transition-colors text-left",
                      selectedProject?.id === project.id
                        ? "bg-zinc-800 text-white font-medium"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{project.name}</div>
                      <div className="truncate text-xs text-zinc-500">{project.website_url}</div>
                    </div>
                    {selectedProject?.id === project.id && (
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
                <div className="border-t border-zinc-800 my-1" />
              </>
            ) : null}
            {selectedProject && (
              <Link
                href="/settings#general"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Project</span>
              </Link>
            )}
            <Link
              href="/projects/new"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Project</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
