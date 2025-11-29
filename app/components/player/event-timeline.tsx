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
      return "text-error";
    }
    if (event.severity === "warning") {
      return "text-warning";
    }
    if (event.type === "rage_click") {
      return "text-error";
    }
    return "text-info";
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
        "bg-white border border-gray-200 lg:border-l-0 lg:border-t rounded-xl lg:rounded-l-none shadow-sm overflow-y-auto",
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
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-gradient-to-b from-white to-gray-50 z-10">
        <h3
          className="text-sm font-bold text-gray-900"
          id="timeline-heading"
        >
          Event Timeline
        </h3>
        <p className="text-xs font-medium text-gray-500 mt-1" aria-live="polite">
          {events.length} {events.length === 1 ? "event" : "events"}
        </p>
      </div>

      <div className="p-4 space-y-2">
        {events.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
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
                "w-full text-left p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 touch-manipulation shadow-sm",
                isActive(event)
                  ? "border-black bg-gray-900 text-white shadow-md scale-[1.02]"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md",
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
                    isActive(event) ? "text-white" : getEventColor(event)
                  )}
                >
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs font-semibold",
                      isActive(event) ? "text-white" : "text-gray-900"
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
                    isActive(event) ? "text-gray-200" : "text-gray-700"
                  )}>
                    {event.description}
                  </p>
                  <p className={cn(
                    "text-xs font-mono",
                    isActive(event) ? "text-gray-300" : "text-gray-500"
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
