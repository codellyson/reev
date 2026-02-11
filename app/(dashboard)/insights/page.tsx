"use client";

import React, { useState, useCallback } from "react";
import { useInsights, useUpdateInsight } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import { InsightCard } from "@/app/components/insights";
import {
  EmptyState,
  Skeleton,
  ErrorBanner,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import { Lightbulb, Filter } from "lucide-react";

const INSIGHT_TYPES = [
  { value: "", label: "All Types" },
  { value: "rage_click", label: "Rage Clicks" },
  { value: "scroll_dropoff", label: "Scroll Dropoff" },
  { value: "form_abandonment", label: "Form Abandonment" },
  { value: "slow_page", label: "Slow Pages" },
  { value: "error_spike", label: "Error Spikes" },
];

const SEVERITY_OPTIONS = [
  { value: "", label: "All Severities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "resolved", label: "Resolved" },
];

export default function InsightsPage() {
  const { selectedProject, loading: projectsLoading } = useProjectContext();
  const [typeFilter, setTypeFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [page, setPage] = useState(1);

  const { insights, data, loading, error } = useInsights({
    type: typeFilter || undefined,
    severity: severityFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: 20,
  });

  const updateInsight = useUpdateInsight();

  const handleStatusChange = useCallback(
    (id: string, status: string) => {
      updateInsight.mutate({ id, status });
    },
    [updateInsight]
  );

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
          title="Insights"
          description="Select a project to view UX insights"
        />
        <EmptyState
          icon={<Lightbulb className="h-8 w-8" />}
          title="No project selected"
          description="Select a project from the switcher above to view insights"
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Insights"
        description={
          data?.total
            ? `${data.total} issue${data.total === 1 ? "" : "s"} found`
            : "Actionable UX issues detected automatically"
        }
        breadcrumbs={[{ label: "Insights" }]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-zinc-500" />
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-zinc-700 px-3 py-1.5 bg-zinc-900 text-zinc-300 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          {INSIGHT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-zinc-700 px-3 py-1.5 bg-zinc-900 text-zinc-300 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          {SEVERITY_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="flex border border-zinc-700 overflow-hidden">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setStatusFilter(s.value);
                setPage(1);
              }}
              className={`text-sm px-3 py-1.5 transition-colors ${
                statusFilter === s.value
                  ? "bg-emerald-500 text-zinc-900 font-medium"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorBanner title="Failed to load insights" message={error} />}

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <EmptyState
          icon={<Lightbulb className="h-8 w-8" />}
          title={statusFilter === "active" ? "No active issues" : "No insights found"}
          description={
            statusFilter === "active"
              ? "Great news! No UX issues detected. Keep collecting data and insights will appear here automatically."
              : "Try adjusting your filters to find insights."
          }
          variant="compact"
        />
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 px-4 py-3">
          <p className="text-sm font-medium text-zinc-400 font-mono">
            Page {data.page} of {data.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(data.totalPages, page + 1))}
              disabled={page === data.totalPages}
              className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
