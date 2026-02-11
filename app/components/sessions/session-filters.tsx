"use client";

import React, { useState } from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Filters {
  dateRange: { start: Date | null; end: Date | null };
  devices: ("desktop" | "mobile" | "tablet")[];
  pageUrl?: string;
  minDuration?: number;
  maxDuration?: number;
  hasErrors?: boolean;
}

export interface SessionFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset?: () => void;
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

export const SessionFilters: React.FC<SessionFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleDevice = (device: "desktop" | "mobile" | "tablet") => {
    const devices = filters.devices.includes(device)
      ? filters.devices.filter((d) => d !== device)
      : [...filters.devices, device];
    updateFilter("devices", devices);
  };

  const hasActiveFilters =
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.devices.length > 0 ||
    filters.pageUrl ||
    filters.minDuration ||
    filters.maxDuration ||
    filters.hasErrors !== undefined;

  const activeFilterCount = [
    filters.dateRange.start || filters.dateRange.end ? 1 : 0,
    filters.devices.length,
    filters.pageUrl ? 1 : 0,
    filters.minDuration || filters.maxDuration ? 1 : 0,
    filters.hasErrors !== undefined ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const applyPreset = (preset: "today" | "last7" | "last30") => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let start: Date;
    switch (preset) {
      case "today":
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;
      case "last7":
        start = new Date(today);
        start.setDate(start.getDate() - 7);
        break;
      case "last30":
        start = new Date(today);
        start.setDate(start.getDate() - 30);
        break;
    }

    updateFilter("dateRange", { start, end: today });
  };

  return (
    <div
      className={cn(
        "w-full sm:w-80 bg-zinc-950 border border-zinc-800 overflow-hidden",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="filters-content"
        aria-label="Toggle filters"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-100">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="default" size="sm" className="bg-emerald-500 text-zinc-900">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        )}
      </button>

      {isOpen && (
        <div
          id="filters-content"
          className="p-4 space-y-6 border-t border-zinc-800"
          role="region"
          aria-label="Filter options"
        >
          {hasActiveFilters && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="w-full justify-center text-sm"
            >
              Clear all filters
            </Button>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 font-mono">
              Date Range
            </label>
            <div className="space-y-2 mb-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => applyPreset("today")}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => applyPreset("last7")}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  Last 7d
                </button>
                <button
                  onClick={() => applyPreset("last30")}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  Last 30d
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  type="date"
                  value={
                    filters.dateRange.start
                      ? filters.dateRange.start.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      ...filters.dateRange,
                      start: e.target.value ? new Date(e.target.value) : null,
                    })
                  }
                  className="w-full h-9 pl-9 pr-3 bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 transition-colors hover:border-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  type="date"
                  value={
                    filters.dateRange.end
                      ? filters.dateRange.end.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      ...filters.dateRange,
                      end: e.target.value ? new Date(e.target.value) : null,
                    })
                  }
                  className="w-full h-9 pl-9 pr-3 bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 transition-colors hover:border-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 font-mono">
              Device Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["desktop", "mobile", "tablet"] as const).map((device) => {
                const Icon = deviceIcons[device];
                const isSelected = filters.devices.includes(device);
                return (
                  <button
                    key={device}
                    onClick={() => toggleDevice(device)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-3 py-2.5 border transition-colors",
                      isSelected
                        ? "bg-emerald-500 border-emerald-500 text-zinc-900"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {deviceLabels[device]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 font-mono">
              Page URL
            </label>
            <input
              type="text"
              value={filters.pageUrl || ""}
              onChange={(e) =>
                updateFilter("pageUrl", e.target.value || undefined)
              }
              placeholder="Filter by URL..."
              className="w-full h-9 px-3 bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 transition-colors hover:border-zinc-600 focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 font-mono">
              Duration (seconds)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.minDuration || ""}
                onChange={(e) =>
                  updateFilter(
                    "minDuration",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="Min"
                className="h-9 px-3 bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 transition-colors hover:border-zinc-600 focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
              />
              <input
                type="number"
                value={filters.maxDuration || ""}
                onChange={(e) =>
                  updateFilter(
                    "maxDuration",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="Max"
                className="h-9 px-3 bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 transition-colors hover:border-zinc-600 focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.hasErrors === true}
                onChange={(e) =>
                  updateFilter("hasErrors", e.target.checked ? true : undefined)
                }
                className="border-zinc-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 bg-zinc-900"
              />
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-100">
                  Has Errors
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
