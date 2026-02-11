"use client";

import React from "react";
import { Search, MapPin, Chrome, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdvancedFiltersProps {
  userId?: string;
  sessionId?: string;
  browser?: string;
  os?: string;
  country?: string;
  minClicks?: number;
  maxClicks?: number;
  hasRageClicks?: boolean;
  onFilterChange: (filters: Partial<AdvancedFiltersProps>) => void;
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  userId,
  sessionId,
  browser,
  os,
  country,
  minClicks,
  maxClicks,
  hasRageClicks,
  onFilterChange,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* User ID / Session ID Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 font-mono uppercase tracking-wider">
            User ID
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={userId || ""}
              onChange={(e) => onFilterChange({ userId: e.target.value || undefined })}
              placeholder="Search by user ID..."
              className="w-full pl-9 pr-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder:text-zinc-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 font-mono uppercase tracking-wider">
            Session ID
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={sessionId || ""}
              onChange={(e) => onFilterChange({ sessionId: e.target.value || undefined })}
              placeholder="Search by session ID..."
              className="w-full pl-9 pr-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder:text-zinc-500"
            />
          </div>
        </div>
      </div>

      {/* Browser & OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 font-mono uppercase tracking-wider">
            Browser
          </label>
          <div className="relative">
            <Chrome className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <select
              value={browser || ""}
              onChange={(e) => onFilterChange({ browser: e.target.value || undefined })}
              className="w-full pl-9 pr-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Browsers</option>
              <option value="chrome">Chrome</option>
              <option value="firefox">Firefox</option>
              <option value="safari">Safari</option>
              <option value="edge">Edge</option>
              <option value="opera">Opera</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 font-mono uppercase tracking-wider">
            Operating System
          </label>
          <select
            value={os || ""}
            onChange={(e) => onFilterChange({ os: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm cursor-pointer"
          >
            <option value="">All OS</option>
            <option value="windows">Windows</option>
            <option value="macos">macOS</option>
            <option value="linux">Linux</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-2 font-mono uppercase tracking-wider">
          Country
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={country || ""}
            onChange={(e) => onFilterChange({ country: e.target.value || undefined })}
            placeholder="Filter by country..."
            className="w-full pl-9 pr-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Click Count Range */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-2 font-mono uppercase tracking-wider">
          Click Count Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minClicks || ""}
            onChange={(e) => onFilterChange({ minClicks: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Min clicks"
            className="px-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder:text-zinc-500"
          />
          <input
            type="number"
            value={maxClicks || ""}
            onChange={(e) => onFilterChange({ maxClicks: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Max clicks"
            className="px-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Rage Clicks */}
      <div className="flex items-center gap-3 p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={hasRageClicks || false}
            onChange={(e) => onFilterChange({ hasRageClicks: e.target.checked || undefined })}
            className="border-zinc-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 bg-zinc-900 w-4 h-4"
          />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">Has Rage Clicks</p>
              <p className="text-xs text-zinc-400">Filter sessions with user frustration</p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
