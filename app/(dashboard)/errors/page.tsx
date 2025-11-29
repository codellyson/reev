"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/app/components/layout";
import { Badge } from "@/app/components/ui";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorGroup {
  id: string;
  message: string;
  type: "error" | "warning" | "info";
  count: number;
  affectedUsers: number;
  lastSeen: Date;
  firstSeen: Date;
  sessions: string[];
  stackTrace?: string;
  url?: string;
}

export default function ErrorsPage() {
  const router = useRouter();
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "error" | "warning" | "info">("all");
  const [sortBy, setSortBy] = useState<"count" | "recent" | "users">("count");

  // Mock error data - replace with real API data
  const errors = useMemo<ErrorGroup[]>(() => [
    {
      id: "1",
      message: "TypeError: Cannot read property 'map' of undefined",
      type: "error",
      count: 45,
      affectedUsers: 12,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30),
      firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      sessions: ["sess_1", "sess_2", "sess_3"],
      stackTrace: "at ProductList.render (ProductList.tsx:42:15)\nat App.render (App.tsx:12:8)",
      url: "/products",
    },
    {
      id: "2",
      message: "Network Error: Failed to fetch user data",
      type: "error",
      count: 32,
      affectedUsers: 8,
      lastSeen: new Date(Date.now() - 1000 * 60 * 45),
      firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      sessions: ["sess_4", "sess_5"],
      url: "/dashboard",
    },
    {
      id: "3",
      message: "Warning: Missing key prop in list iteration",
      type: "warning",
      count: 128,
      affectedUsers: 45,
      lastSeen: new Date(Date.now() - 1000 * 60 * 5),
      firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      sessions: ["sess_6", "sess_7", "sess_8"],
      url: "/sessions",
    },
    {
      id: "4",
      message: "Deprecated API usage: componentWillMount",
      type: "warning",
      count: 67,
      affectedUsers: 23,
      lastSeen: new Date(Date.now() - 1000 * 60 * 120),
      firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      sessions: ["sess_9"],
      url: "/checkout",
    },
  ], []);

  const filteredErrors = useMemo(() => {
    let result = filterType === "all" ? errors : errors.filter(e => e.type === filterType);

    return result.sort((a, b) => {
      switch (sortBy) {
        case "count":
          return b.count - a.count;
        case "recent":
          return b.lastSeen.getTime() - a.lastSeen.getTime();
        case "users":
          return b.affectedUsers - a.affectedUsers;
        default:
          return 0;
      }
    });
  }, [errors, filterType, sortBy]);

  const stats = useMemo(() => ({
    total: errors.reduce((sum, e) => sum + e.count, 0),
    unique: errors.length,
    users: new Set(errors.flatMap(e => e.sessions)).size,
  }), [errors]);

  const getErrorIcon = (type: ErrorGroup["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
    }
  };

  const getErrorColor = (type: ErrorGroup["type"]) => {
    switch (type) {
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Errors"
        description="Track and debug JavaScript errors and exceptions"
        breadcrumbs={[{ label: "Errors" }]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Errors
            </span>
            <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-red-600 border border-gray-200">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-black">{stats.total.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Unique Issues
            </span>
            <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-orange-600 border border-gray-200">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-black">{stats.unique}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Affected Sessions
            </span>
            <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-blue-600 border border-gray-200">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-black">{stats.users}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Type:</span>
          <div className="flex gap-2">
            {(["all", "error", "warning", "info"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
                  filterType === type
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 border-none rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="count">Most Frequent</option>
            <option value="recent">Most Recent</option>
            <option value="users">Most Users</option>
          </select>
        </div>
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {filteredErrors.map((error) => (
          <div
            key={error.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <button
              onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-lg border", getErrorColor(error.type))}>
                  {getErrorIcon(error.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-base font-semibold text-black line-clamp-2">
                      {error.message}
                    </h3>
                    {expandedError === error.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">{error.count}</span>
                      <span>occurrences</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{error.affectedUsers}</span>
                      <span>users</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(error.lastSeen)}</span>
                    </div>
                    {error.url && (
                      <Badge variant="default" size="sm" className="bg-gray-100 text-gray-700">
                        {error.url}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {expandedError === error.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                {error.stackTrace && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Stack Trace</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono">
                      {error.stackTrace}
                    </pre>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Affected Sessions ({error.sessions.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {error.sessions.map((sessionId) => (
                      <button
                        key={sessionId}
                        onClick={() => router.push(`/session/${sessionId}`)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-black hover:bg-gray-100 hover:border-gray-300 transition-colors"
                      >
                        {sessionId}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>First seen: {error.firstSeen.toLocaleString()}</span>
                  <span>•</span>
                  <span>Last seen: {error.lastSeen.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
