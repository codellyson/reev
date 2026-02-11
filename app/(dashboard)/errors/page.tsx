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
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "warning":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "info":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
        <div className="bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono">
              Total Errors
            </span>
            <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.total.toLocaleString()}</div>
        </div>

        <div className="bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono">
              Unique Issues
            </span>
            <div className="w-10 h-10 bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.unique}</div>
        </div>

        <div className="bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono">
              Affected Sessions
            </span>
            <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.users}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-zinc-950 border border-zinc-800 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-400">Type:</span>
          <div className="flex gap-2">
            {(["all", "error", "warning", "info"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-all",
                  filterType === type
                    ? "bg-emerald-500 text-zinc-900"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-800" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 text-sm font-medium bg-zinc-900 border border-zinc-700 text-zinc-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
            className="bg-zinc-950 border border-zinc-800 overflow-hidden"
          >
            <button
              onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
              className="w-full p-6 text-left hover:bg-zinc-900/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-2 border", getErrorColor(error.type))}>
                  {getErrorIcon(error.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-base font-medium text-zinc-100 line-clamp-2">
                      {error.message}
                    </h3>
                    {expandedError === error.id ? (
                      <ChevronDown className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium font-mono">{error.count}</span>
                      <span>occurrences</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Users className="h-4 w-4" />
                      <span className="font-medium font-mono">{error.affectedUsers}</span>
                      <span>users</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono">{formatTimeAgo(error.lastSeen)}</span>
                    </div>
                    {error.url && (
                      <Badge variant="default" size="sm">
                        {error.url}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {expandedError === error.id && (
              <div className="border-t border-zinc-800 bg-zinc-900 p-6 space-y-4">
                {error.stackTrace && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-300 mb-2 font-mono">Stack Trace</h4>
                    <pre className="bg-zinc-950 text-zinc-300 p-4 text-xs overflow-x-auto font-mono border border-zinc-800">
                      {error.stackTrace}
                    </pre>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2 font-mono">
                    Affected Sessions ({error.sessions.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {error.sessions.map((sessionId) => (
                      <button
                        key={sessionId}
                        onClick={() => router.push(`/session/${sessionId}`)}
                        className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        {sessionId}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
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
