"use client";

import React, { useState } from "react";
import {
  MousePointer,
  Link2,
  ImageOff,
  FormInput,
  Check,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  ChevronUp,
  Clock,
  Camera,
  Code,
  AlertTriangle,
  Footprints,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Report } from "@/types/api";

const ISSUE_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  rage_click: {
    icon: <MousePointer className="h-3.5 w-3.5" />,
    label: "Rage Click",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  dead_link: {
    icon: <Link2 className="h-3.5 w-3.5" />,
    label: "Dead Link",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  broken_image: {
    icon: <ImageOff className="h-3.5 w-3.5" />,
    label: "Broken Image",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  form_frustration: {
    icon: <FormInput className="h-3.5 w-3.5" />,
    label: "Form Frustration",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
};

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  desktop: <Monitor className="h-3 w-3" />,
  mobile: <Smartphone className="h-3 w-3" />,
  tablet: <Tablet className="h-3 w-3" />,
};

function getPagePath(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

interface ReportCardProps {
  report: Report;
  onResolve: (id: number, status: "open" | "resolved") => void;
  resolving?: boolean;
}

export function ReportCard({ report, onResolve, resolving }: ReportCardProps) {
  const [expanded, setExpanded] = useState(false);

  const config = ISSUE_TYPE_CONFIG[report.issue_type] || {
    icon: <MousePointer className="h-3.5 w-3.5" />,
    label: report.issue_type,
    color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  };

  const pagePath = getPagePath(report.page_url);
  const isResolved = report.status === "resolved";
  const ctx = report.context;
  const hasContext = ctx && (
    ctx.screenshot ||
    ctx.domSnapshot ||
    (ctx.consoleErrors && ctx.consoleErrors.length > 0) ||
    (ctx.breadcrumbs && ctx.breadcrumbs.length > 0) ||
    ctx.timeOnPage
  );

  return (
    <div className={`bg-zinc-950 border transition-colors ${isResolved ? "border-zinc-800/50 opacity-60" : "border-zinc-800 hover:border-zinc-700"}`}>
      <div className="p-4">
        {/* Top row: badges + timestamp */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border ${config.color}`}>
            {config.icon}
            {config.label}
          </span>

          {report.device && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] text-zinc-500 bg-zinc-900 border border-zinc-800">
              {DEVICE_ICONS[report.device] || null}
              {report.device}
            </span>
          )}

          {report.browser && (
            <span className="text-[11px] text-zinc-600 px-1.5 py-0.5 bg-zinc-900 border border-zinc-800">
              {report.browser}
            </span>
          )}

          {ctx?.timeOnPage != null && (
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-600 px-1.5 py-0.5 bg-zinc-900 border border-zinc-800">
              <Clock className="h-2.5 w-2.5" />
              {formatSeconds(ctx.timeOnPage)}
            </span>
          )}

          <span className="ml-auto text-xs text-zinc-600">
            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
          </span>
        </div>

        {/* Message — the hero */}
        {report.message ? (
          <p className="text-sm text-zinc-200 leading-relaxed mb-3">
            &ldquo;{report.message}&rdquo;
          </p>
        ) : (
          <p className="text-sm text-zinc-600 italic mb-3">
            No message &mdash; {config.label.toLowerCase()} detected
          </p>
        )}

        {/* Bottom row: page + selector + actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 min-w-0">
            {pagePath && (
              <span className="truncate max-w-[250px] font-mono" title={report.page_url || ""}>
                {pagePath}
              </span>
            )}
            {report.issue_selector && pagePath && (
              <span className="text-zinc-700">&middot;</span>
            )}
            {report.issue_selector && (
              <code className="truncate max-w-[180px] text-zinc-600 font-mono" title={report.issue_selector}>
                {report.issue_selector}
              </code>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {hasContext && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                Context
              </button>
            )}
            <button
              onClick={() => onResolve(report.id, isResolved ? "open" : "resolved")}
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
      </div>

      {/* Expanded context panel */}
      {expanded && hasContext && ctx && (
        <div className="border-t border-zinc-800 px-4 py-3 space-y-3 bg-zinc-900/50">
          {/* Screenshot */}
          {ctx.screenshot && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider mb-2">
                <Camera className="h-3 w-3" />
                Screenshot
              </div>
              <img
                src={ctx.screenshot}
                alt="Page screenshot at time of frustration"
                className="max-w-full max-h-64 border border-zinc-800 rounded"
              />
            </div>
          )}

          {/* DOM Snapshot */}
          {ctx.domSnapshot && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider mb-2">
                <Code className="h-3 w-3" />
                Element Snapshot
              </div>
              <pre className="text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 p-2 overflow-x-auto max-h-32 font-mono">
                {ctx.domSnapshot}
              </pre>
            </div>
          )}

          {/* Console Errors */}
          {ctx.consoleErrors && ctx.consoleErrors.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider mb-2">
                <AlertTriangle className="h-3 w-3" />
                Console Errors ({ctx.consoleErrors.length})
              </div>
              <div className="space-y-1">
                {ctx.consoleErrors.map((err, i) => (
                  <div key={i} className="text-xs font-mono bg-zinc-950 border border-zinc-800 px-2 py-1.5">
                    <span className="text-red-400">{err.message}</span>
                    {err.source && (
                      <span className="text-zinc-600 ml-2">
                        {err.source}{err.line ? `:${err.line}` : ""}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Breadcrumb Trail */}
          {ctx.breadcrumbs && ctx.breadcrumbs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider mb-2">
                <Footprints className="h-3 w-3" />
                User Trail ({ctx.breadcrumbs.length} actions)
              </div>
              <div className="space-y-0.5">
                {ctx.breadcrumbs.map((crumb, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs py-0.5">
                    <span className="text-zinc-600 w-12 shrink-0 text-right font-mono">
                      {crumb.action}
                    </span>
                    <span className="text-zinc-700">&rarr;</span>
                    <span className="text-zinc-400 truncate font-mono">
                      {crumb.target || crumb.url || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
