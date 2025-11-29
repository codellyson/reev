"use client";

import { useState } from "react";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { Button, Modal, FormField, Input } from "@/app/components/ui";
import { useToast } from "@/app/components/ui";
import { clsx } from "clsx";

interface Tag {
  id: string;
  name: string;
  color: string;
  session_count?: number;
}

interface TagManagerProps {
  tags: Tag[];
  onTagCreate: (name: string, color: string) => Promise<void>;
  onTagDelete: (tagId: string) => Promise<void>;
}

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export function TagManager({
  tags,
  onTagCreate,
  onTagDelete,
}: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const { success, error: showError } = useToast();

  const handleCreate = async () => {
    if (!name.trim()) {
      showError("Tag name is required");
      return;
    }

    setIsCreating(true);
    try {
      await onTagCreate(name.trim(), selectedColor);
      success("Tag created successfully");
      setName("");
      setSelectedColor(PRESET_COLORS[0]);
      setIsOpen(false);
    } catch (err) {
      showError("Failed to create tag");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      await onTagDelete(tagId);
      success("Tag deleted successfully");
    } catch (err) {
      showError("Failed to delete tag");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tags
        </h3>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          New Tag
        </Button>
      </div>

      <div className="space-y-2">
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
            No tags yet. Create one to get started.
          </p>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {tag.name}
                </span>
                {tag.session_count !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({tag.session_count} sessions)
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(tag.id)}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Delete tag"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TagIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Tag
            </h2>
          </div>

          <div className="space-y-4">
            <FormField label="Tag Name" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bug, Feature Request"
                maxLength={50}
              />
            </FormField>

            <FormField label="Color">
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={clsx(
                      "w-8 h-8 rounded transition-all",
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110"
                        : "hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </FormField>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? "Creating..." : "Create Tag"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
