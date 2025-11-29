"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SessionList,
  SessionFilters,
  SearchBar,
  ActiveFilters,
} from "@/app/components/sessions";
import { useSessions } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import type { Filters } from "@/app/components/sessions/session-filters";
import {
  LoadingSpinner,
  ErrorBanner,
  EmptyState,
  SkeletonTable,
  SkeletonSessionRow,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import { List } from "lucide-react";

export default function SessionsPage() {
  const router = useRouter();
  const { selectedProject, projects, loading: projectsLoading } = useProjectContext();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: null, end: null },
    devices: [],
    pageUrl: undefined,
    minDuration: undefined,
    maxDuration: undefined,
    hasErrors: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams = useMemo(
    () => ({
      page,
      limit: 50,
      ...(filters.dateRange.start &&
        filters.dateRange.end && {
          dateRange: {
            start: filters.dateRange.start.toISOString(),
            end: filters.dateRange.end.toISOString(),
          },
        }),
      ...(filters.devices.length > 0 && { devices: filters.devices }),
      ...(filters.pageUrl && { pageUrl: filters.pageUrl }),
      ...(filters.minDuration && { minDuration: filters.minDuration }),
      ...(filters.maxDuration && { maxDuration: filters.maxDuration }),
      ...(filters.hasErrors !== undefined && { hasErrors: filters.hasErrors }),
    }),
    [page, filters]
  );

  const { data, loading, error } = useSessions(queryParams);

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <SkeletonTable />
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Sessions"
          description="Select or create a project to view sessions"
        />
        <EmptyState
          icon={<List className="h-8 w-8" />}
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

  const handleSessionClick = useCallback(
    (session: any) => {
      router.push(`/session/${session.id}`);
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      dateRange: { start: null, end: null },
      devices: [],
      pageUrl: undefined,
      minDuration: undefined,
      maxDuration: undefined,
      hasErrors: undefined,
    });
    setSearchQuery("");
  }, []);

  const handleRemoveFilter = useCallback((key: keyof Filters, value?: any) => {
    setFilters((prev) => {
      if (key === "dateRange") {
        return { ...prev, dateRange: { start: null, end: null } };
      }
      if (key === "devices") {
        return { ...prev, devices: value || [] };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const mappedSessions = useMemo(() => {
    return (
      data?.data.map((s) => ({
        ...s,
        timestamp:
          typeof s.timestamp === "string" ? new Date(s.timestamp) : s.timestamp,
      })) || []
    );
  }, [data?.data]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Sessions"
        description={
          data?.total
            ? `${data.total.toLocaleString()} total sessions`
            : "All recorded sessions"
        }
        breadcrumbs={[{ label: "Sessions" }]}
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by URL or Session ID..."
              />
            </div>
          </div>

          <ActiveFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleResetFilters}
          />

          {error && (
            <ErrorBanner title="Failed to load sessions" message={error} />
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <SkeletonSessionRow key={i} />
              ))}
            </div>
          ) : mappedSessions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <EmptyState
                icon={<List className="h-8 w-8" />}
                title="No sessions found"
                description="Try adjusting your filters or check back later when sessions are recorded."
                action={{
                  label: "Clear Filters",
                  onClick: handleResetFilters,
                  variant: "secondary",
                }}
                variant="compact"
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <SessionList
                sessions={mappedSessions}
                onSessionClick={handleSessionClick}
                loading={loading}
              />
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
              <p className="text-sm font-medium text-gray-600">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-auto">
          <SessionFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}
