"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/app/components/ui";
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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface InsightCardProps {
  insight: Insight;
  onStatusChange?: (id: string, status: string) => void;
  compact?: boolean;
}

const SEVERITY_STYLES = {
  critical: {
    border: "border-red-500/50",
    bg: "bg-red-500/10",
    dot: "bg-red-500",
    badge: "error" as const,
  },
  high: {
    border: "border-orange-500/50",
    bg: "bg-orange-500/10",
    dot: "bg-orange-500",
    badge: "warning" as const,
  },
  medium: {
    border: "border-amber-500/50",
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
    badge: "warning" as const,
  },
  low: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/10",
    dot: "bg-blue-500",
    badge: "info" as const,
  },
};

const TYPE_CONFIG = {
  rage_click: {
    icon: MousePointerClick,
    label: "Rage Clicks",
  },
  scroll_dropoff: {
    icon: ArrowDownToLine,
    label: "Scroll Dropoff",
  },
  form_abandonment: {
    icon: FormInput,
    label: "Form Abandonment",
  },
  slow_page: {
    icon: Gauge,
    label: "Slow Page",
  },
  error_spike: {
    icon: AlertTriangle,
    label: "Error Spike",
  },
};

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onStatusChange,
  compact = false,
}) => {
  const severity = SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.medium;
  const typeConfig = TYPE_CONFIG[insight.type] || {
    icon: AlertTriangle,
    label: insight.type,
  };
  const Icon = typeConfig.icon;

  return (
    <div
      className={cn(
        "border bg-zinc-950 transition-colors hover:bg-zinc-900/50",
        severity.border,
        insight.status === "resolved" ? "opacity-60" : ""
      )}
    >
      <div className={cn("p-4", compact ? "p-3" : "p-4")}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex-shrink-0 p-2",
              severity.bg
            )}
          >
            <Icon className="h-4 w-4 text-zinc-300" />
          </div>

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

            {insight.description && !compact && (
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                {insight.description}
              </p>
            )}

            {insight.url && (
              <p className="text-xs text-zinc-500 mt-1 truncate flex items-center gap-1">
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                {insight.url}
              </p>
            )}

            {!compact && (
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-zinc-500 font-mono">
                  First seen{" "}
                  {formatDistanceToNow(new Date(insight.firstSeenAt), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  Last seen{" "}
                  {formatDistanceToNow(new Date(insight.lastSeenAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}
          </div>

          {onStatusChange && insight.status !== "resolved" && (
            <div className="flex gap-1 flex-shrink-0">
              {insight.status === "active" && (
                <button
                  onClick={() => onStatusChange(insight.id, "acknowledged")}
                  className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Acknowledge"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onStatusChange(insight.id, "resolved")}
                className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Resolve"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
