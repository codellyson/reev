"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInsights, useInsightSummary } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import { IssueCard, SeverityGroup } from "@/app/components/issues";
import {
  EmptyState,
  Skeleton,
  ErrorBanner,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import { ShieldAlert, TrendingUp, ArrowDown, Minus, Sparkles } from "lucide-react";
import type { Insight } from "@/types/api";

const SEVERITY_ORDER = ["critical", "high", "medium", "low"] as const;

export default function IssuesPage() {
  const router = useRouter();
  const { selectedProject, projects, loading: projectsLoading } = useProjectContext();
  const [statusFilter, setStatusFilter] = useState<"active" | "all">("active");

  const filters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : "active",
      limit: 100,
    }),
    [statusFilter]
  );

  const { insights, loading, error } = useInsights(filters);
  const { summary, loading: summaryLoading } = useInsightSummary();

  const grouped = useMemo(() => {
    const groups: Record<string, Insight[]> = {};
    for (const sev of SEVERITY_ORDER) {
      groups[sev] = [];
    }
    for (const insight of insights) {
      if (groups[insight.severity]) {
        groups[insight.severity].push(insight);
      } else {
        groups[insight.severity] = [insight];
      }
    }
    return groups;
  }, [insights]);

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Issues"
          description="Select or create a project to see UX issues"
        />
        <EmptyState
          icon={<ShieldAlert className="h-8 w-8" />}
          title="No project selected"
          description={
            projects.length === 0
              ? "Create your first project to start tracking UX issues"
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
        title="Issues"
        description={
          summary && summary.total > 0
            ? `${summary.total} active ${summary.total === 1 ? "issue" : "issues"}`
            : "UX issues detected on your site"
        }
        breadcrumbs={[{ label: "Issues" }]}
      />

      {/* Summary bar */}
      {summary && summary.total > 0 && !summaryLoading && (
        <div className="flex items-center gap-4 flex-wrap">
          {/* Severity pills */}
          {SEVERITY_ORDER.map((sev) => {
            const count = summary.bySeverity[sev] || 0;
            if (count === 0) return null;
            const colors: Record<string, string> = {
              critical: "bg-red-500/10 text-red-400 border-red-500/20",
              high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
              medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            };
            return (
              <span
                key={sev}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border ${colors[sev]}`}
              >
                {count} {sev}
              </span>
            );
          })}

          <div className="flex-1" />

          {/* Trend indicators */}
          {(summary.trending.worsening || 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-red-400">
              <TrendingUp className="h-3 w-3" />
              {summary.trending.worsening} worsening
            </span>
          )}
          {(summary.trending.improving || 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
              <ArrowDown className="h-3 w-3" />
              {summary.trending.improving} improving
            </span>
          )}
        </div>
      )}

      {/* Status toggle */}
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 w-fit">
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            statusFilter === "active"
              ? "bg-emerald-500 text-zinc-900"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-emerald-500 text-zinc-900"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          All
        </button>
      </div>

      {/* Error state */}
      {error && <ErrorBanner title="Failed to load issues" message={error} />}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        /* Empty state */
        <div className="bg-zinc-950 border border-zinc-800">
          <EmptyState
            icon={<ShieldAlert className="h-8 w-8" />}
            title={statusFilter === "active" ? "No active issues" : "No issues found"}
            description={
              statusFilter === "active"
                ? "No UX issues detected. Install the tracker on your site and check back when data is collected."
                : "No issues have been recorded yet."
            }
            action={
              statusFilter === "active"
                ? {
                    label: "Setup Tracker",
                    onClick: () => router.push("/settings"),
                  }
                : undefined
            }
            variant="compact"
          />
        </div>
      ) : (
        /* Issues grouped by severity */
        <div className="space-y-8">
          {SEVERITY_ORDER.map((sev) => {
            const issues = grouped[sev];
            if (!issues || issues.length === 0) return null;
            return (
              <SeverityGroup key={sev} severity={sev} count={issues.length}>
                {issues.map((insight) => (
                  <IssueCard key={insight.id} insight={insight} />
                ))}
              </SeverityGroup>
            );
          })}
        </div>
      )}
    </div>
  );
}
