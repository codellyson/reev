"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReports, useResolveReport } from "@/app/hooks/use-reports";
import { useProjectContext } from "@/app/providers/project-provider";
import { ReportCard } from "@/app/components/reports/report-card";
import {
  EmptyState,
  Skeleton,
  ErrorBanner,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import { MessageSquare, MousePointer, Link2, ImageOff, FormInput, Search } from "lucide-react";

const ISSUE_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  rage_click: {
    icon: <MousePointer className="h-4 w-4" />,
    label: "Rage Click",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  dead_link: {
    icon: <Link2 className="h-4 w-4" />,
    label: "Dead Link",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  broken_image: {
    icon: <ImageOff className="h-4 w-4" />,
    label: "Broken Image",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  form_frustration: {
    icon: <FormInput className="h-4 w-4" />,
    label: "Form Frustration",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
};

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedProject, projects, loading: projectsLoading } = useProjectContext();

  const [typeFilter, setTypeFilter] = useState<string | undefined>(
    searchParams.get("issueType") || undefined
  );
  const [statusFilter, setStatusFilter] = useState<"open" | "resolved" | "all">(
    (searchParams.get("status") as "open" | "resolved" | "all") || "open"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [offset, setOffset] = useState(0);

  const pageUrl = searchParams.get("pageUrl") || undefined;
  const limit = 20;

  const { reports, total, summary, loading, error } = useReports({
    status: statusFilter,
    issueType: typeFilter,
    search: search || undefined,
    pageUrl,
    limit,
    offset,
  });

  const resolveReport = useResolveReport();

  const handleResolve = (id: number, status: "open" | "resolved") => {
    resolveReport.mutate({ id, status });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setOffset(0);
  };

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Reports"
          description="Select or create a project to see frustration reports"
        />
        <EmptyState
          icon={<MessageSquare className="h-8 w-8" />}
          title="No project selected"
          description={
            projects.length === 0
              ? "Create your first project to start collecting reports"
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
        title="Reports"
        description={
          total > 0
            ? `${total} frustration ${total === 1 ? "report" : "reports"} from real users`
            : "Frustration reports from your users"
        }
        breadcrumbs={[{ label: "Reports" }]}
      />

      {/* Filters */}
      <div className="space-y-3">
        {/* Status + type filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status toggle */}
          {(["open", "resolved", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setOffset(0); }}
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
            onClick={() => { setTypeFilter(undefined); setOffset(0); }}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              !typeFilter
                ? "bg-orange-500 text-zinc-900 border-orange-500"
                : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
            }`}
          >
            All{summary.length > 0 && ` (${total})`}
          </button>
          {summary.map(({ type, count }) => {
            const config = ISSUE_TYPE_CONFIG[type];
            if (!config) return null;
            return (
              <button
                key={type}
                onClick={() => { setTypeFilter(type === typeFilter ? undefined : type); setOffset(0); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors ${
                  typeFilter === type
                    ? "bg-orange-500 text-zinc-900 border-orange-500"
                    : `${config.color} hover:opacity-80`
                }`}
              >
                {config.icon}
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by message or page URL..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </form>
      </div>

      {/* Error state */}
      {error && <ErrorBanner title="Failed to load reports" message={error} />}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800">
          <EmptyState
            icon={<MessageSquare className="h-8 w-8" />}
            title="No reports yet"
            description="When users encounter frustration and submit feedback via the popover, their reports will appear here."
            action={{
              label: "Setup Tracker",
              onClick: () => router.push("/settings"),
            }}
            variant="compact"
          />
        </div>
      ) : (
        <>
          {/* Report feed */}
          <div className="space-y-3">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onResolve={handleResolve}
                resolving={resolveReport.isPending}
              />
            ))}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-zinc-500">
                Showing {offset + 1}&ndash;{Math.min(offset + limit, total)} of {total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
