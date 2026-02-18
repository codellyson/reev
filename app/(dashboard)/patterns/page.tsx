"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePatterns, useUpdatePattern } from "@/app/hooks/use-patterns";
import { useProjectContext } from "@/app/providers/project-provider";
import { PatternCard } from "@/app/components/patterns/pattern-card";
import {
  EmptyState,
  Skeleton,
  ErrorBanner,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import { Layers, MousePointer, Link2, ImageOff, FormInput } from "lucide-react";

const ISSUE_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string }> = {
  rage_click: { icon: <MousePointer className="h-4 w-4" />, label: "Rage Click" },
  dead_link: { icon: <Link2 className="h-4 w-4" />, label: "Dead Link" },
  broken_image: { icon: <ImageOff className="h-4 w-4" />, label: "Broken Image" },
  form_frustration: { icon: <FormInput className="h-4 w-4" />, label: "Form Frustration" },
};

export default function PatternsPage() {
  const router = useRouter();
  const { selectedProject, projects, loading: projectsLoading } = useProjectContext();

  const [statusFilter, setStatusFilter] = useState<"open" | "resolved" | "all">("open");
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const { patterns, total, loading, error } = usePatterns({
    status: statusFilter,
    issueType: typeFilter,
  });

  const updatePattern = useUpdatePattern();

  const handleResolve = (id: number, status: "open" | "resolved") => {
    updatePattern.mutate({ id, status });
  };

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Patterns"
          description="Select or create a project to see recurring issues"
        />
        <EmptyState
          icon={<Layers className="h-8 w-8" />}
          title="No project selected"
          description={
            projects.length === 0
              ? "Create your first project to start detecting patterns"
              : "Please select a project from the switcher above"
          }
          action={
            projects.length === 0
              ? { label: "Create Project", onClick: () => router.push("/projects/new") }
              : undefined
          }
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Patterns"
        description={
          total > 0
            ? `${total} recurring ${total === 1 ? "issue" : "issues"} detected`
            : "Recurring frustration patterns across your users"
        }
        breadcrumbs={[{ label: "Patterns" }]}
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status toggle */}
        {(["open", "resolved", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors capitalize ${
              statusFilter === s
                ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
            }`}
          >
            {s}
          </button>
        ))}

        <span className="w-px h-5 bg-zinc-800 mx-1" />

        {/* Type filters */}
        <button
          onClick={() => setTypeFilter(undefined)}
          className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
            !typeFilter
              ? "bg-orange-500 text-zinc-900 border-orange-500"
              : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
          }`}
        >
          All
        </button>
        {Object.entries(ISSUE_TYPE_CONFIG).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type === typeFilter ? undefined : type)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors ${
              typeFilter === type
                ? "bg-orange-500 text-zinc-900 border-orange-500"
                : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
            }`}
          >
            {config.icon}
            {config.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && <ErrorBanner title="Failed to load patterns" message={error} />}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : patterns.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800">
          <EmptyState
            icon={<Layers className="h-8 w-8" />}
            title="No patterns yet"
            description="Patterns emerge when 2+ users report the same type of frustration on the same page. Keep collecting reports."
            variant="compact"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {patterns.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              onResolve={handleResolve}
              resolving={updatePattern.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
