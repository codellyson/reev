"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui";
import { Bookmark, Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Filters } from "./session-filters";

export interface SavedFilter {
  id: string;
  name: string;
  filters: Filters;
  createdAt: Date;
}

export interface SavedFiltersProps {
  savedFilters: SavedFilter[];
  currentFilters: Filters;
  onLoadFilter: (filters: Filters) => void;
  onSaveFilter: (name: string, filters: Filters) => void;
  onDeleteFilter: (id: string) => void;
  className?: string;
}

export const SavedFilters: React.FC<SavedFiltersProps> = ({
  savedFilters,
  currentFilters,
  onLoadFilter,
  onSaveFilter,
  onDeleteFilter,
  className,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [filterName, setFilterName] = useState("");

  const handleSave = () => {
    if (filterName.trim()) {
      onSaveFilter(filterName.trim(), currentFilters);
      setFilterName("");
      setIsCreating(false);
    }
  };

  const hasActiveFilters =
    currentFilters.dateRange.start ||
    currentFilters.dateRange.end ||
    currentFilters.devices.length > 0 ||
    currentFilters.pageUrl ||
    currentFilters.minDuration ||
    currentFilters.maxDuration ||
    currentFilters.hasErrors !== undefined;

  return (
    <div className={cn("bg-white border border-gray-200 rounded-xl shadow-sm p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-black">Saved Filters</h3>
        </div>
        {hasActiveFilters && !isCreating && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Save Current
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Filter name..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setIsCreating(false);
                setFilterName("");
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!filterName.trim()}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false);
                setFilterName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {savedFilters.length === 0 ? (
          <div className="text-center py-8">
            <Bookmark className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No saved filters yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Apply filters and save them for quick access
            </p>
          </div>
        ) : (
          savedFilters.map((filter) => (
            <div
              key={filter.id}
              className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <button
                onClick={() => onLoadFilter(filter.filters)}
                className="flex-1 text-left"
              >
                <p className="text-sm font-medium text-black group-hover:text-black">
                  {filter.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filter.createdAt.toLocaleDateString()}
                </p>
              </button>
              <button
                onClick={() => onDeleteFilter(filter.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 transition-all"
                aria-label="Delete filter"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
