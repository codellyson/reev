"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Clock } from "lucide-react";
import { StatsCard } from "@/app/components/analytics";
import { SessionList } from "@/app/components/sessions";
import { useStats, useSessions } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import {
  LoadingSpinner,
  ErrorBanner,
  EmptyState,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonStats,
  SkeletonSessionRow,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";

export default function DashboardPage() {
  const router = useRouter();
  const { selectedProject, projects, loading: projectsLoading } = useProjectContext();
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

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <SkeletonStats cards={2} />
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
          description={projects.length === 0 
            ? "Create your first project to start tracking sessions"
            : "Please select a project from the switcher above"}
          action={projects.length === 0 ? {
            label: "Create Project",
            onClick: () => router.push("/projects/new"),
          } : undefined}
          variant="compact"
        />
      </div>
    );
  }

  if (statsLoading || sessionsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <SkeletonStats cards={2} />
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          {[...Array(5)].map((_, i) => (
            <SkeletonSessionRow key={i} />
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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">Recent Sessions</h2>
          {mappedSessions.length > 0 && (
            <Link
              href="/sessions"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors inline-flex items-center gap-1 group"
            >
              <span>View all</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          )}
        </div>
        {mappedSessions.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-8 w-8" />}
            title="No sessions yet"
            description="Once you install the tracking code and users visit your site, sessions will appear here."
            steps={[
              "Add the tracker script to your website's <head> tag",
              "Configure your project ID in the tracker",
              "Wait for users to visit your site and interact",
            ]}
            action={{
              label: "Get Tracking Code",
              onClick: () => router.push("/setup"),
            }}
            variant="compact"
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

