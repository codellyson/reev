"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SessionList, SessionFilters, SearchBar, ActiveFilters } from "@/app/components/sessions";
import { useSessions } from "@/app/hooks";
import type { Filters } from "@/app/components/sessions/session-filters";
import { LoadingSpinner, ErrorBanner, EmptyState, SkeletonTable } from "@/app/components/ui";
import { List } from "lucide-react";

export default function SessionsPage() {
  const router = useRouter();
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

  const queryParams = useMemo(() => ({
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
  }), [page, filters]);

  const { data, loading, error } = useSessions(queryParams);

  console.log("error", error)

  const handleSessionClick = useCallback((session: any) => {
    router.push(`/session/${session.id}`);
  }, [router]);

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
    return data?.data.map((s) => ({
      ...s,
      timestamp: typeof s.timestamp === "string" ? new Date(s.timestamp) : s.timestamp,
    })) || [];
  }, [data?.data]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-black">Sessions</h1>
        {data?.total ? (
          <p className="text-sm text-gray-600 mt-1">
            {data.total.toLocaleString()} total sessions
          </p>
        ) : !loading && (
          <p className="text-sm text-gray-600 mt-1">
            All recorded sessions
          </p>
        )}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
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

          {error && <ErrorBanner title="Failed to load sessions" message={error} />}

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <SkeletonTable />
            </div>
          ) : mappedSessions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg">
              <EmptyState
                icon={<List className="h-16 w-16" />}
                title="No sessions found"
                description="Try adjusting your filters or check back later when sessions are recorded."
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <SessionList
                sessions={mappedSessions}
                onSessionClick={handleSessionClick}
                loading={loading}
              />
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <SessionFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>
    </div>
  );
}

