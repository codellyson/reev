"use client";

import React from "react";
import { MousePointer, Link2, ImageOff, FormInput, Check, RotateCcw, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { Pattern } from "@/types/api";

const ISSUE_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  rage_click: {
    icon: <MousePointer className="h-4 w-4" />,
    label: "Rage Click",
    color: "text-amber-400",
  },
  dead_link: {
    icon: <Link2 className="h-4 w-4" />,
    label: "Dead Link",
    color: "text-red-400",
  },
  broken_image: {
    icon: <ImageOff className="h-4 w-4" />,
    label: "Broken Image",
    color: "text-orange-400",
  },
  form_frustration: {
    icon: <FormInput className="h-4 w-4" />,
    label: "Form Frustration",
    color: "text-blue-400",
  },
};

interface PatternCardProps {
  pattern: Pattern;
  onResolve: (id: number, status: "open" | "resolved") => void;
  resolving?: boolean;
}

export function PatternCard({ pattern, onResolve, resolving }: PatternCardProps) {
  const config = ISSUE_TYPE_CONFIG[pattern.issue_type] || {
    icon: <MousePointer className="h-4 w-4" />,
    label: pattern.issue_type,
    color: "text-zinc-400",
  };

  const isResolved = pattern.status === "resolved";

  return (
    <div className={`bg-zinc-950 border p-5 transition-colors ${isResolved ? "border-zinc-800/50 opacity-60" : "border-zinc-800 hover:border-zinc-700"}`}>
      {/* Header: icon + count + last seen */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={config.color}>{config.icon}</span>
          <span className="text-sm font-semibold text-white">
            {pattern.report_count} {pattern.report_count === 1 ? "report" : "reports"}
          </span>
        </div>
        <span className="text-xs text-zinc-600">
          Last seen {formatDistanceToNow(new Date(pattern.last_seen_at), { addSuffix: true })}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-zinc-300 mb-3">{pattern.title}</h3>

      {/* Recent messages */}
      {pattern.recent_messages && pattern.recent_messages.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {pattern.recent_messages.map((msg, i) => (
            <p key={i} className="text-xs text-zinc-500 leading-relaxed">
              &ldquo;{msg}&rdquo;
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
        <Link
          href={`/reports?issueType=${pattern.issue_type}&pageUrl=${encodeURIComponent(pattern.page_url_pattern || "")}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View all reports
        </Link>

        <button
          onClick={() => onResolve(pattern.id, isResolved ? "open" : "resolved")}
          disabled={resolving}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors ${
            isResolved
              ? "text-zinc-500 hover:text-white hover:bg-zinc-800"
              : "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
          }`}
        >
          {isResolved ? (
            <>
              <RotateCcw className="h-3 w-3" />
              Reopen
            </>
          ) : (
            <>
              <Check className="h-3 w-3" />
              Resolve
            </>
          )}
        </button>
      </div>
    </div>
  );
}
