"use client";

import React, { useState } from "react";
import { usePages } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import {
  EmptyState,
  Skeleton,
  ErrorBanner,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import { FileText, ArrowUpDown, ExternalLink } from "lucide-react";

const SORT_OPTIONS = [
  { value: "views", label: "Most Views" },
  { value: "errors", label: "Most Errors" },
  { value: "rage_clicks", label: "Most Rage Clicks" },
  { value: "scroll", label: "Lowest Scroll Depth" },
  { value: "lcp", label: "Slowest LCP" },
];

const TIME_OPTIONS = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
];

export default function PagesPage() {
  const { selectedProject, loading: projectsLoading } = useProjectContext();
  const [sortBy, setSortBy] = useState("views");
  const [days, setDays] = useState(7);
  const [page, setPage] = useState(1);

  const { pages, data, loading, error } = usePages({
    sortBy,
    days,
    page,
    limit: 20,
  });

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Pages"
          description="Select a project to view page analytics"
        />
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No project selected"
          description="Select a project from the switcher above"
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pages"
        description={
          data?.total
            ? `${data.total} page${data.total === 1 ? "" : "s"} tracked`
            : "Page-level analytics and performance"
        }
        breadcrumbs={[{ label: "Pages" }]}
      />

      <div className="flex flex-wrap items-center gap-3">
        <ArrowUpDown className="h-4 w-4 text-zinc-500" />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-zinc-700 px-3 py-1.5 bg-zinc-900 text-zinc-300 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={days}
          onChange={(e) => {
            setDays(parseInt(e.target.value));
            setPage(1);
          }}
          className="text-sm border border-zinc-700 px-3 py-1.5 bg-zinc-900 text-zinc-300 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorBanner title="Failed to load pages" message={error} />}

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : pages.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No page data yet"
          description="Page analytics will appear here once the tracker starts collecting data."
          variant="compact"
        />
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    Page URL
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    Sessions
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    Scroll
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    Avg Time
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    Errors
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    Rage
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-900">
                    LCP
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr
                    key={p.url}
                    className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 max-w-xs">
                        <ExternalLink className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                        <span className="truncate text-zinc-100 font-medium">
                          {formatUrl(p.url)}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-zinc-100 font-medium font-mono">
                      {p.views.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-zinc-400 font-mono">
                      {p.uniqueSessions.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      <span
                        className={
                          p.avgScrollDepth < 30
                            ? "text-red-400 font-medium"
                            : p.avgScrollDepth < 60
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }
                      >
                        {p.avgScrollDepth}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-zinc-400 font-mono">
                      {formatDuration(p.avgTimeOnPage)}
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      <span
                        className={
                          p.errorCount > 0
                            ? "text-red-400 font-medium"
                            : "text-zinc-600"
                        }
                      >
                        {p.errorCount}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      <span
                        className={
                          p.rageClickCount > 0
                            ? "text-orange-400 font-medium"
                            : "text-zinc-600"
                        }
                      >
                        {p.rageClickCount}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      {p.avgLcp ? (
                        <span
                          className={
                            p.avgLcp > 4000
                              ? "text-red-400 font-medium"
                              : p.avgLcp > 2500
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }
                        >
                          {(p.avgLcp / 1000).toFixed(1)}s
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function formatUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
