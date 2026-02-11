"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/app/components/layout";
import { MetricChart } from "@/app/components/analytics/metric-chart";
import { StatsCard } from "@/app/components/analytics";
import { useStats, useTrend, usePages } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import {
  Eye,
  Activity,
  ArrowDownToLine,
  AlertTriangle,
} from "lucide-react";
import {
  ErrorBanner,
  EmptyState,
  Skeleton,
  SkeletonCard,
} from "@/app/components/ui";

export default function AnalyticsPage() {
  const { selectedProject, loading: projectsLoading } = useProjectContext();
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const [days, setDays] = useState(7);
  const { trend, loading: trendLoading } = useTrend(days);

  const pageFilters = useMemo(() => ({ days, sortBy: "views", limit: 5 }), [days]);
  const { pages, loading: pagesLoading } = usePages(pageFilters);

  const pageviewChartData = useMemo(() => {
    if (!trend) return [];
    return trend.dates.map((date, i) => ({
      date: formatChartDate(date),
      value: trend.pageviews[i],
    }));
  }, [trend]);

  const sessionsChartData = useMemo(() => {
    if (!trend) return [];
    return trend.dates.map((date, i) => ({
      date: formatChartDate(date),
      value: trend.sessions[i],
    }));
  }, [trend]);

  const errorsChartData = useMemo(() => {
    if (!trend) return [];
    return trend.dates.map((date, i) => ({
      date: formatChartDate(date),
      value: trend.errors[i],
    }));
  }, [trend]);

  const loading = statsLoading || trendLoading || projectsLoading;

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader title="Analytics" description="Select a project to view analytics" />
        <EmptyState
          icon={<Activity className="h-8 w-8" />}
          title="No project selected"
          description="Select a project from the switcher above"
          variant="compact"
        />
      </div>
    );
  }

  if (statsError) {
    return <ErrorBanner title="Failed to load analytics" message={statsError} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Analytics"
          description="Traffic and performance overview"
          breadcrumbs={[{ label: "Analytics" }]}
        />
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="text-sm border border-zinc-700 px-3 py-1.5 bg-zinc-900 text-zinc-300 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
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
      )}

      {/* Trends */}
      {trendLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800">
          <SkeletonCard className="h-96" />
          <SkeletonCard className="h-96" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800">
            <div className="bg-zinc-950 p-6">
              <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">Pageview Trend</h3>
              {pageviewChartData.length > 0 ? (
                <MetricChart
                  data={pageviewChartData}
                  type="area"
                  color="#10b981"
                  height={280}
                />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-zinc-500 text-sm">
                  No data for this period
                </div>
              )}
            </div>

            <div className="bg-zinc-950 p-6">
              <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">Session Trend</h3>
              {sessionsChartData.length > 0 ? (
                <MetricChart
                  data={sessionsChartData}
                  type="line"
                  color="#34d399"
                  height={280}
                />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-zinc-500 text-sm">
                  No data for this period
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">Error Trend</h3>
            {errorsChartData.length > 0 ? (
              <MetricChart
                data={errorsChartData}
                type="bar"
                color="#f87171"
                height={280}
              />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-zinc-500 text-sm">
                No data for this period
              </div>
            )}
          </div>
        </>
      )}

      {/* Top Pages */}
      {!pagesLoading && pages.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">Top Pages</h3>
          <div className="space-y-2">
            {pages.map((page, index) => (
              <div
                key={page.url}
                className="flex items-center justify-between p-3 hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">
                      {formatPageUrl(page.url)}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono">
                      {page.views} views · {page.avgScrollDepth}% scroll ·{" "}
                      {page.errorCount} errors
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatChartDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } catch {
    return dateStr;
  }
}

function formatPageUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}
