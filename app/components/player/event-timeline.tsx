"use client";

import React from "react";
import {
  MousePointer,
  Navigation,
  AlertCircle,
  Scroll,
  Zap,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface TimelineEvent {
  type: "click" | "navigation" | "error" | "scroll" | "rage_click";
  timestamp: number;
  description: string;
  severity?: "info" | "warning" | "error";
}

export interface EventTimelineProps {
  events: TimelineEvent[];
  currentTime?: number;
  onEventClick?: (event: TimelineEvent) => void;
  className?: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  currentTime = 0,
  onEventClick,
  className,
}) => {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "click":
      case "rage_click":
        return <MousePointer className="h-4 w-4" />;
      case "navigation":
        return <Navigation className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "scroll":
        return <Scroll className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.severity === "error" || event.type === "error") {
      return "text-red-400";
    }
    if (event.severity === "warning") {
      return "text-amber-400";
    }
    if (event.type === "rage_click") {
      return "text-red-400";
    }
    return "text-blue-400";
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isActive = (event: TimelineEvent) => {
    return Math.abs(event.timestamp - currentTime) < 1;
  };

  return (
    <div
      className={cn(
        "bg-zinc-950 border border-zinc-800 overflow-y-auto",
        className
      )}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
      }}
      role="region"
      aria-labelledby="timeline-heading"
    >
      <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
        <h3
          className="text-sm font-semibold text-white font-mono uppercase tracking-wider"
          id="timeline-heading"
        >
          Event Timeline
        </h3>
        <p className="text-xs font-medium text-zinc-500 mt-1 font-mono" aria-live="polite">
          {events.length} {events.length === 1 ? "event" : "events"}
        </p>
      </div>

      <div className="p-4 space-y-2">
        {events.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">
            No events recorded
          </p>
        ) : (
          events.map((event, index) => (
            <button
              key={index}
              onClick={() => onEventClick?.(event)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onEventClick) {
                  e.preventDefault();
                  onEventClick(event);
                }
              }}
              className={cn(
                "w-full text-left p-3 border transition-all duration-200 focus:outline-none touch-manipulation",
                isActive(event)
                  ? "border-emerald-500 bg-emerald-500/10 text-white"
                  : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50",
                onEventClick && "cursor-pointer"
              )}
              aria-label={`Event: ${event.type} at ${formatTimestamp(
                event.timestamp
              )}`}
              aria-current={isActive(event) ? "true" : undefined}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 mt-0.5",
                    isActive(event) ? "text-emerald-400" : getEventColor(event)
                  )}
                >
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs font-semibold font-mono",
                      isActive(event) ? "text-emerald-400" : "text-zinc-100"
                    )}>
                      {event.type.replace("_", " ").toUpperCase()}
                    </span>
                    {event.severity && (
                      <Badge
                        variant={
                          event.severity === "error" ? "error" : "warning"
                        }
                        size="sm"
                      >
                        {event.severity}
                      </Badge>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm mb-2 line-clamp-2",
                    isActive(event) ? "text-zinc-300" : "text-zinc-400"
                  )}>
                    {event.description}
                  </p>
                  <p className={cn(
                    "text-xs font-mono",
                    isActive(event) ? "text-zinc-400" : "text-zinc-500"
                  )}>
                    {formatTimestamp(event.timestamp)}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
