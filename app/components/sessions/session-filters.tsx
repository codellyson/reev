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
        "w-full sm:w-80 bg-white border border-gray-200 rounded-lg overflow-hidden",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-base focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-t-lg"
        aria-expanded={isOpen}
        aria-controls="filters-content"
        aria-label="Toggle filters"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-black">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="default" size="sm" className="bg-black text-white">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div
          id="filters-content"
          className="p-4 space-y-6 border-t border-gray-200"
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
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
              Date Range
            </label>
            <div className="space-y-2 mb-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => applyPreset("today")}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-base"
                >
                  Today
                </button>
                <button
                  onClick={() => applyPreset("last7")}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-base"
                >
                  Last 7d
                </button>
                <button
                  onClick={() => applyPreset("last30")}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-base"
                >
                  Last 30d
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                  className="w-full h-9 pl-9 pr-3 bg-white border border-gray-200 rounded-md text-sm text-black transition-base hover:border-gray-400 focus:outline-none focus:border-black"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                  className="w-full h-9 pl-9 pr-3 bg-white border border-gray-200 rounded-md text-sm text-black transition-base hover:border-gray-400 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
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
                      "flex flex-col items-center gap-1.5 px-3 py-2.5 border rounded-md transition-base",
                      isSelected
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
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
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
              Page URL
            </label>
            <input
              type="text"
              value={filters.pageUrl || ""}
              onChange={(e) =>
                updateFilter("pageUrl", e.target.value || undefined)
              }
              placeholder="Filter by URL..."
              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-md text-sm text-black transition-base hover:border-gray-400 focus:outline-none focus:border-black placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
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
                className="h-9 px-3 bg-white border border-gray-200 rounded-md text-sm text-black transition-base hover:border-gray-400 focus:outline-none focus:border-black placeholder:text-gray-400"
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
                className="h-9 px-3 bg-white border border-gray-200 rounded-md text-sm text-black transition-base hover:border-gray-400 focus:outline-none focus:border-black placeholder:text-gray-400"
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
                className="rounded border-gray-300 text-black focus:ring-black focus:ring-offset-0"
              />
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-black">
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
