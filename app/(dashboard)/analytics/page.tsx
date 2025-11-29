"use client";

import React, { useMemo } from "react";
import { PageHeader } from "@/app/components/layout";
import { MetricChart } from "@/app/components/analytics/metric-chart";
import { StatsCard } from "@/app/components/analytics";
import { useStats } from "@/app/hooks";
import {
  TrendingUp,
  Users,
  Clock,
  Activity,
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle,
  MousePointer
} from "lucide-react";
import { LoadingSpinner, ErrorBanner, Skeleton, SkeletonCard } from "@/app/components/ui";

export default function AnalyticsPage() {
  const { stats, loading, error } = useStats();

  // Mock data for charts - replace with real API data
  const sessionTrendData = useMemo(() => [
    { date: "Mon", value: 245 },
    { date: "Tue", value: 312 },
    { date: "Wed", value: 289 },
    { date: "Thu", value: 401 },
    { date: "Fri", value: 378 },
    { date: "Sat", value: 167 },
    { date: "Sun", value: 198 },
  ], []);

  const errorTrendData = useMemo(() => [
    { date: "Mon", value: 12 },
    { date: "Tue", value: 18 },
    { date: "Wed", value: 8 },
    { date: "Thu", value: 23 },
    { date: "Fri", value: 15 },
    { date: "Sat", value: 5 },
    { date: "Sun", value: 7 },
  ], []);

  const durationTrendData = useMemo(() => [
    { date: "Mon", value: 142 },
    { date: "Tue", value: 156 },
    { date: "Wed", value: 138 },
    { date: "Thu", value: 165 },
    { date: "Fri", value: 149 },
    { date: "Sat", value: 121 },
    { date: "Sun", value: 128 },
  ], []);

  const deviceBreakdown = useMemo(() => ({
    desktop: 62,
    mobile: 28,
    tablet: 10,
  }), []);

  const topPages = useMemo(() => [
    { url: "/products", sessions: 1234, avgDuration: 145 },
    { url: "/checkout", sessions: 892, avgDuration: 203 },
    { url: "/", sessions: 756, avgDuration: 98 },
    { url: "/about", sessions: 543, avgDuration: 67 },
    { url: "/contact", sessions: 321, avgDuration: 112 },
  ], []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="h-96" />
          <SkeletonCard className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner title="Failed to load analytics" message={error} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Analytics"
        description="Insights and trends for your session data"
        breadcrumbs={[{ label: "Analytics" }]}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Activity className="h-5 w-5" />}
          label="Total Sessions"
          value={stats?.totalSessions.toLocaleString() || "0"}
          change={12.5}
          trend="up"
          comparison="vs last week"
        />
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          label="Unique Users"
          value="1,234"
          change={8.2}
          trend="up"
          comparison="vs last week"
        />
        <StatsCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg Duration"
          value={`${Math.floor((stats?.avgDuration || 0) / 60)}m ${(stats?.avgDuration || 0) % 60}s`}
          change={-3.1}
          trend="down"
          comparison="vs last week"
        />
        <StatsCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Error Rate"
          value="2.3%"
          change={-15.4}
          trend="up"
          comparison="vs last week"
        />
      </div>

      {/* Session Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-bold text-black mb-6">Session Trend</h3>
          <MetricChart
            data={sessionTrendData}
            type="area"
            color="#0070f3"
            height={300}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-bold text-black mb-6">Error Trend</h3>
          <MetricChart
            data={errorTrendData}
            type="bar"
            color="#ff3b30"
            height={300}
          />
        </div>
      </div>

      {/* Average Duration Trend */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
        <h3 className="text-lg font-bold text-black mb-6">Average Session Duration (seconds)</h3>
        <MetricChart
          data={durationTrendData}
          type="line"
          color="#00c853"
          height={300}
        />
      </div>

      {/* Device Breakdown & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-bold text-black mb-6">Device Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Desktop</p>
                  <p className="text-xs text-gray-600">{deviceBreakdown.desktop}% of sessions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-black">{deviceBreakdown.desktop}%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${deviceBreakdown.desktop}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Mobile</p>
                  <p className="text-xs text-gray-600">{deviceBreakdown.mobile}% of sessions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-black">{deviceBreakdown.mobile}%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full transition-all duration-500"
                style={{ width: `${deviceBreakdown.mobile}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Tablet className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Tablet</p>
                  <p className="text-xs text-gray-600">{deviceBreakdown.tablet}% of sessions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-black">{deviceBreakdown.tablet}%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${deviceBreakdown.tablet}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-bold text-black mb-6">Top Pages</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.url} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{page.url}</p>
                    <p className="text-xs text-gray-600">
                      {page.sessions} sessions · {page.avgDuration}s avg
                    </p>
                  </div>
                </div>
                <MousePointer className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
