"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Clock } from "lucide-react";
import { StatsCard } from "@/app/components/analytics";
import { SessionList } from "@/app/components/sessions";
import { useStats, useSessions } from "@/app/hooks";
import { LoadingSpinner, ErrorBanner, EmptyState, Skeleton, SkeletonCard, SkeletonTable } from "@/app/components/ui";

export default function DashboardPage() {
  const router = useRouter();
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const queryParams = useMemo(() => ({ limit: 10 }), []);
  const { data: sessionsData, loading: sessionsLoading } = useSessions(queryParams);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleSessionClick = useCallback((session: any) => {
    router.push(`/session/${session.id}`);
  }, [router]);

  const mappedSessions = useMemo(() => {
    return sessionsData?.data.map((s) => ({
      ...s,
      timestamp: typeof s.timestamp === "string" ? new Date(s.timestamp) : s.timestamp,
    })) || [];
  }, [sessionsData?.data]);

  if (statsLoading || sessionsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <SkeletonTable />
        </div>
      </div>
    );
  }

  if (statsError) {
    return <ErrorBanner title="Failed to load dashboard" message={statsError} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-black">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          icon={<Activity className="h-5 w-5" />}
          label="Total Sessions"
          value={stats?.totalSessions.toLocaleString() || "0"}
        />
        <StatsCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg Duration"
          value={formatDuration(stats?.avgDuration || 0)}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Recent Sessions</h2>
          {mappedSessions.length > 0 && (
            <Link
              href="/sessions"
              className="text-sm text-gray-600 hover:text-black transition-base"
            >
              View all →
            </Link>
          )}
        </div>
        {mappedSessions.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-16 w-16" />}
            title="No sessions yet"
            description="Once you install the tracking code and users visit your site, sessions will appear here."
            action={{
              label: "Get Tracking Code",
              onClick: () => router.push("/setup"),
            }}
          />
        ) : (
          <SessionList
            sessions={mappedSessions}
            onSessionClick={handleSessionClick}
            loading={sessionsLoading}
          />
        )}
      </div>
    </div>
  );
}

