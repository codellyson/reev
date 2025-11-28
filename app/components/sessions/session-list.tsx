"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Play, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Session {
  id: string;
  duration: number;
  pageUrl: string;
  timestamp: Date;
  device: "desktop" | "mobile" | "tablet";
  userAgent: string;
  clicks: number;
  errors?: number;
}

export interface SessionListProps {
  sessions: Session[];
  onSessionClick?: (session: Session) => void;
  onDelete?: (sessionId: string) => void;
  loading?: boolean;
}

type SortField = keyof Session;
type SortDirection = "asc" | "desc";

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onSessionClick,
  onDelete,
  loading = false,
}) => {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue == null || bValue == null) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDeviceBadgeVariant = (device: Session["device"]) => {
    switch (device) {
      case "desktop":
        return "default";
      case "mobile":
        return "info";
      case "tablet":
        return "success";
      default:
        return "default";
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-gray-700" />
    ) : (
      <ArrowDown className="h-4 w-4 text-gray-700" />
    );
  };

  const columns: Array<{ key?: SortField; label: string; sortable?: boolean }> = [
    { key: "id" as SortField, label: "Session ID" },
    { key: "duration" as SortField, label: "Duration" },
    { key: "pageUrl" as SortField, label: "Page URL" },
    { key: "timestamp" as SortField, label: "Timestamp" },
    { key: "device" as SortField, label: "Device" },
    { label: "Actions", sortable: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.label}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider",
                  col.sortable !== false && "cursor-pointer hover:text-black"
                )}
                onClick={() => col.sortable !== false && col.key && handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable !== false && col.key && <SortIcon field={col.key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {sortedSessions.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-600">
                No sessions found
              </td>
            </tr>
          ) : (
            sortedSessions.map((session, index) => (
              <tr
                key={session.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-base cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 20}ms` }}
                onClick={() => onSessionClick?.(session)}
              >
                <td className="px-4 py-3 text-sm font-mono text-black">
                  {session.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {formatDuration(session.duration)}
                </td>
                <td className="px-4 py-3 text-sm text-black max-w-xs truncate">
                  {session.pageUrl}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {format(session.timestamp, "MMM d, yyyy HH:mm")}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getDeviceBadgeVariant(session.device)} size="sm">
                    {session.device}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSessionClick?.(session)}
                      aria-label="Play session"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(session.id)}
                        aria-label="Delete session"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-error" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

