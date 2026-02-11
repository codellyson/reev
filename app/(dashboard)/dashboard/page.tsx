"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Eye, ArrowDownToLine, AlertTriangle, Lightbulb } from "lucide-react";
import { StatsCard } from "@/app/components/analytics";
import { useStats, useInsights } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import { InsightCard } from "@/app/components/insights";
import {
  ErrorBanner,
  EmptyState,
  Skeleton,
  SkeletonStats,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";

export default function DashboardPage() {
  const router = useRouter();
  const { selectedProject, projects, loading: projectsLoading } = useProjectContext();
  const { stats, loading: statsLoading, error: statsError } = useStats();

  const insightFilters = useMemo(() => ({ status: "active", limit: 5 }), []);
  const { insights, loading: insightsLoading } = useInsights(insightFilters);

  const handleInsightStatusChange = useCallback(
    (_id: string, _status: string) => {
      router.push("/insights");
    },
    [router]
  );

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <SkeletonStats cards={4} />
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Select or create a project to get started"
        />
        <EmptyState
          icon={<Activity className="h-8 w-8" />}
          title="No project selected"
          description={
            projects.length === 0
              ? "Create your first project to start tracking"
              : "Please select a project from the switcher above"
          }
          action={
            projects.length === 0
              ? {
                  label: "Create Project",
                  onClick: () => router.push("/projects/new"),
                }
              : undefined
          }
          variant="compact"
        />
      </div>
    );
  }

  if (statsLoading || insightsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <SkeletonStats cards={4} />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return <ErrorBanner title="Failed to load dashboard" message={statsError} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Welcome back"
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      {/* Stats Grid - gap-px trick */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
        <StatsCard
          icon={<Eye className="h-5 w-5" />}
          label="Pageviews Today"
          value={stats?.totalPageviews.toLocaleString() || "0"}
        />
        <StatsCard
          icon={<Activity className="h-5 w-5" />}
          label="Unique Sessions"
          value={stats?.uniqueSessions.toLocaleString() || "0"}
        />
        <StatsCard
          icon={<ArrowDownToLine className="h-5 w-5" />}
          label="Avg Scroll Depth"
          value={`${stats?.avgScrollDepth || 0}%`}
        />
        <StatsCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Errors Today"
          value={stats?.errorCount.toLocaleString() || "0"}
        />
      </div>

      {/* Top Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Active Issues</h2>
          {insights.length > 0 && (
            <Link
              href="/insights"
              className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group"
            >
              <span>View all</span>
              <span className="group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          )}
        </div>
        {insights.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800">
            <EmptyState
              icon={<Lightbulb className="h-8 w-8" />}
              title="No active issues"
              description="Great news! No UX issues detected. Insights will appear here automatically as data is collected."
              variant="compact"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onStatusChange={handleInsightStatusChange}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Pages */}
      {stats?.topPages && stats.topPages.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Top Pages Today</h2>
            <Link
              href="/pages"
              className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group"
            >
              <span>View all</span>
              <span className="group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>
          <div className="space-y-1">
            {stats.topPages.map((page) => (
              <div
                key={page.url}
                className="flex items-center justify-between py-2 px-3 hover:bg-zinc-900 transition-colors"
              >
                <span className="text-sm text-zinc-300 truncate flex-1 mr-4">
                  {formatPageUrl(page.url)}
                </span>
                <span className="text-sm font-medium text-zinc-100 tabular-nums font-mono">
                  {page.count.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatPageUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}
