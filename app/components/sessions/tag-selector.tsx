"use client";

import { useState } from "react";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { Button, Badge } from "@/app/components/ui";
import { clsx } from "clsx";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagAdd: (tagId: string) => void;
  onTagRemove: (tagId: string) => void;
  compact?: boolean;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagAdd,
  onTagRemove,
  compact = false,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTagIds = new Set(selectedTags.map((t) => t.id));
  const unselectedTags = availableTags.filter((tag) => !selectedTagIds.has(tag.id));

  return (
    <div className={clsx("relative", compact ? "inline-block" : "space-y-2")}>
      {!compact && selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={() => onTagRemove(tag.id)}
              removable
            />
          ))}
        </div>
      )}

      {compact && (
        <div className="flex items-center gap-2">
          {selectedTags.slice(0, 3).map((tag) => (
            <TagBadge key={tag.id} tag={tag} compact />
          ))}
          {selectedTags.length > 3 && (
            <span className="text-xs text-zinc-500">
              +{selectedTags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx("gap-1", compact && "p-1")}
        >
          <Plus className="w-4 h-4" />
          {!compact && "Add Tag"}
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 z-20 p-2 max-h-64 overflow-auto">
              {unselectedTags.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No more tags available
                </p>
              ) : (
                <div className="space-y-1">
                  {unselectedTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        onTagAdd(tag.id);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm text-zinc-100">
                        {tag.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  removable?: boolean;
  compact?: boolean;
}

export function TagBadge({ tag, onRemove, removable, compact }: TagBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 text-white",
        compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
      style={{ backgroundColor: tag.color }}
    >
      <span>{tag.name}</span>
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-white/20 p-0.5 transition-colors"
          aria-label="Remove tag"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
