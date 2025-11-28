"use client";

import React from "react";
import { X, Monitor, Smartphone, Tablet, Calendar, Globe, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import type { Filters } from "./session-filters";
import { cn } from "@/lib/utils";

export interface ActiveFiltersProps {
  filters: Filters;
  onRemoveFilter: (key: keyof Filters, value?: any) => void;
  onClearAll: () => void;
  className?: string;
}

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const deviceLabels = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
};

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}) => {
  const activeFilters: Array<{ key: string; label: string; value: string; onRemove: () => void }> = [];

  if (filters.dateRange.start || filters.dateRange.end) {
    const start = filters.dateRange.start
      ? new Date(filters.dateRange.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "";
    const end = filters.dateRange.end
      ? new Date(filters.dateRange.end).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "";
    const label = start && end ? `${start} - ${end}` : start || end;
    activeFilters.push({
      key: "dateRange",
      label: `Date: ${label}`,
      value: "dateRange",
      onRemove: () => onRemoveFilter("dateRange", { start: null, end: null }),
    });
  }

  filters.devices.forEach((device) => {
    activeFilters.push({
      key: `device-${device}`,
      label: deviceLabels[device],
      value: device,
      onRemove: () => {
        const newDevices = filters.devices.filter((d) => d !== device);
        onRemoveFilter("devices", newDevices);
      },
    });
  });

  if (filters.pageUrl) {
    activeFilters.push({
      key: "pageUrl",
      label: `URL: ${filters.pageUrl.length > 30 ? filters.pageUrl.substring(0, 30) + "..." : filters.pageUrl}`,
      value: filters.pageUrl,
      onRemove: () => onRemoveFilter("pageUrl", undefined),
    });
  }

  if (filters.minDuration || filters.maxDuration) {
    const min = filters.minDuration || 0;
    const max = filters.maxDuration || "∞";
    activeFilters.push({
      key: "duration",
      label: `Duration: ${min}s - ${max}s`,
      value: "duration",
      onRemove: () => {
        onRemoveFilter("minDuration", undefined);
        onRemoveFilter("maxDuration", undefined);
      },
    });
  }

  if (filters.hasErrors === true) {
    activeFilters.push({
      key: "hasErrors",
      label: "Has Errors",
      value: "hasErrors",
      onRemove: () => onRemoveFilter("hasErrors", undefined),
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="default"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700"
        >
          {filter.key === "dateRange" && <Calendar className="h-3 w-3" />}
          {filter.key.startsWith("device-") && (
            React.createElement(deviceIcons[filter.value as keyof typeof deviceIcons], { className: "h-3 w-3" })
          )}
          {filter.key === "pageUrl" && <Globe className="h-3 w-3" />}
          {filter.key === "duration" && <Clock className="h-3 w-3" />}
          {filter.key === "hasErrors" && <AlertCircle className="h-3 w-3" />}
          <span>{filter.label}</span>
          <button
            onClick={filter.onRemove}
            className="ml-1 hover:opacity-70 transition-base"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-gray-600 hover:text-black transition-base font-medium"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

