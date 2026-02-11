"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/app/components/ui";
import { IssueSparkline } from "./issue-sparkline";
import { useInsightSessions, useUpdateInsight } from "@/app/hooks";
import type { Insight } from "@/types/api";
import {
  MousePointerClick,
  ArrowDownToLine,
  FormInput,
  Gauge,
  AlertTriangle,
  Check,
  Eye,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface IssueCardProps {
  insight: Insight;
  onStatusChanged?: () => void;
}

const SEVERITY_STYLES: Record<string, { border: string; bg: string; badge: "error" | "warning" | "info" }> = {
  critical: { border: "border-red-500/50", bg: "bg-red-500/10", badge: "error" },
  high: { border: "border-orange-500/50", bg: "bg-orange-500/10", badge: "warning" },
  medium: { border: "border-amber-500/50", bg: "bg-amber-500/10", badge: "warning" },
  low: { border: "border-blue-500/50", bg: "bg-blue-500/10", badge: "info" },
};

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  rage_click: { icon: MousePointerClick, label: "Rage Clicks" },
  scroll_dropoff: { icon: ArrowDownToLine, label: "Scroll Dropoff" },
  form_abandonment: { icon: FormInput, label: "Form Abandonment" },
  slow_page: { icon: Gauge, label: "Slow Page" },
  error_spike: { icon: AlertTriangle, label: "Error Spike" },
};

const TREND_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  worsening: { icon: TrendingUp, label: "Getting worse", color: "text-red-400" },
  improving: { icon: TrendingDown, label: "Improving", color: "text-emerald-400" },
  stable: { icon: Minus, label: "Stable", color: "text-zinc-500" },
  new: { icon: Sparkles, label: "New", color: "text-blue-400" },
};

export const IssueCard: React.FC<IssueCardProps> = ({ insight, onStatusChanged }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const updateInsight = useUpdateInsight();
  const { sessions, loading: sessionsLoading } = useInsightSessions(
    expanded ? insight.id : null
  );

  const severity = SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.medium;
  const typeConfig = TYPE_CONFIG[insight.type] || { icon: AlertTriangle, label: insight.type };
  const trendConfig = TREND_CONFIG[insight.trend] || TREND_CONFIG.new;
  const Icon = typeConfig.icon;
  const TrendIcon = trendConfig.icon;

  const history = insight.metadata?.history as Array<{ value: number }> | undefined;

  const handleStatusChange = async (status: string) => {
    try {
      await updateInsight.mutateAsync({ id: insight.id, status });
      onStatusChanged?.();
    } catch {
      // Error handled by mutation
    }
  };

  const formatUrl = (url: string) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  };

  return (
    <div
      className={cn(
        "border bg-zinc-950 transition-colors",
        severity.border,
        insight.status === "resolved" && "opacity-60"
      )}
    >
      {/* Main row — clickable to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div className={cn("flex-shrink-0 p-2", severity.bg)}>
            <Icon className="h-4 w-4 text-zinc-300" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={severity.badge} size="sm">
                {insight.severity}
              </Badge>
              <Badge variant="default" size="sm">
                {typeConfig.label}
              </Badge>
              {insight.occurrences > 1 && (
                <span className="text-xs text-zinc-500 font-mono">
                  {insight.occurrences}x
                </span>
              )}
            </div>

            <h3 className="text-sm font-medium text-zinc-100 mt-1.5 leading-snug">
              {insight.title}
            </h3>

            {insight.url && (
              <p className="text-xs text-zinc-500 mt-1 truncate flex items-center gap-1">
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                {formatUrl(insight.url)}
              </p>
            )}

            {/* Trend + timestamps row */}
            <div className="flex items-center gap-4 mt-2">
              <span className={cn("text-xs font-medium flex items-center gap-1", trendConfig.color)}>
                <TrendIcon className="h-3 w-3" />
                {trendConfig.label}
              </span>
              <span className="text-xs text-zinc-600 font-mono">
                {formatDistanceToNow(new Date(insight.lastSeenAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Right side: sparkline + expand indicator */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {history && history.length >= 2 && (
              <IssueSparkline data={history} trend={insight.trend} />
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-zinc-600 transition-transform",
                expanded && "rotate-180"
              )}
            />
          </div>
        </div>
      </button>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-zinc-800/50 px-4 pb-4 space-y-4">
          {/* Description */}
          {insight.description && (
            <p className="text-sm text-zinc-400 pt-3">{insight.description}</p>
          )}

          {/* Suggestion */}
          {insight.suggestion && (
            <div className="flex gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20">
              <Lightbulb className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300">{insight.suggestion}</p>
            </div>
          )}

          {/* Linked sessions */}
          <div>
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Affected Sessions
            </h4>
            {sessionsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-zinc-900 animate-pulse" />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-xs text-zinc-600">No sessions found in the last 7 days</p>
            ) : (
              <div className="space-y-1">
                {sessions.slice(0, 10).map((session) => (
                  <button
                    key={session.id}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-zinc-500 font-mono flex-shrink-0">
                        {session.device}
                      </span>
                      <span className="text-sm text-zinc-300 truncate">
                        {session.pageUrl || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {session.errors > 0 && (
                        <span className="text-xs text-red-400 font-mono">
                          {session.errors} err
                        </span>
                      )}
                      <span className="text-xs text-zinc-500 font-mono">
                        {session.duration ? `${session.duration}s` : "—"}
                      </span>
                      <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        →
                      </span>
                    </div>
                  </button>
                ))}
                {sessions.length > 10 && (
                  <p className="text-xs text-zinc-600 pt-1">
                    +{sessions.length - 10} more sessions
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {insight.status !== "resolved" && (
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/50">
              {insight.status === "active" && (
                <button
                  onClick={() => handleStatusChange("acknowledged")}
                  disabled={updateInsight.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Acknowledge
                </button>
              )}
              <button
                onClick={() => handleStatusChange("resolved")}
                disabled={updateInsight.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                Resolve
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
