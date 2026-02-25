"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  FolderOpen,
  FileText,
  RefreshCw,
  X,
  Trash2,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { Button, Skeleton } from "@/app/components/ui";
import { useSitemap, useCreateBulkFlowSuggestions } from "@/app/hooks/use-flows";
import { pathToLabel } from "@/lib/sitemap";
import type { SitemapTreeNode } from "@/types/api";

interface SitemapTreePanelProps {
  projectId: string;
  onClose: () => void;
  onCreated: (count: number) => void;
}

// ─── Tree Node ───────────────────────────────────────────

interface TreeNodeProps {
  node: SitemapTreeNode;
  depth: number;
  selectedPaths: Set<string>;
  onToggleSelect: (path: string) => void;
  expandedPaths: Set<string>;
  onToggleExpand: (path: string) => void;
}

function TreeNode({
  node,
  depth,
  selectedPaths,
  onToggleSelect,
  expandedPaths,
  onToggleExpand,
}: TreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPaths.has(node.path);

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 pr-2 cursor-pointer transition-colors group ${
          isSelected
            ? "bg-orange-500/10 text-orange-400"
            : "hover:bg-zinc-800/50 text-zinc-300"
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => {
          if (node.isPage) {
            onToggleSelect(node.path);
          } else if (hasChildren) {
            onToggleExpand(node.path);
          }
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.path);
            }}
            className="flex-shrink-0 p-0.5 hover:text-white transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-[18px] flex-shrink-0" />
        )}

        {node.isPage ? (
          <span
            className={`flex-shrink-0 w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${
              isSelected
                ? "bg-orange-500 border-orange-500"
                : "border-zinc-600 group-hover:border-zinc-500"
            }`}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </span>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {hasChildren ? (
          <FolderOpen className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
        ) : (
          <FileText className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <span
            className={`text-sm font-medium truncate block ${
              !node.isPage ? "text-zinc-500 italic" : ""
            }`}
          >
            {node.label}
          </span>
          {node.path !== "/" && (
            <span className="text-[11px] text-zinc-600 truncate block">
              {node.path}
            </span>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPaths={selectedPaths}
              onToggleSelect={onToggleSelect}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Collect all page paths from tree ────────────────────

function collectPages(node: SitemapTreeNode): string[] {
  const pages: string[] = [];
  if (node.isPage) pages.push(node.path);
  for (const child of node.children) {
    pages.push(...collectPages(child));
  }
  return pages;
}

// ─── Main Panel ──────────────────────────────────────────

export const SitemapTreePanel: React.FC<SitemapTreePanelProps> = ({
  projectId,
  onClose,
  onCreated,
}) => {
  const sitemap = useSitemap();
  const bulkCreate = useCreateBulkFlowSuggestions();

  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [sourceUrl, setSourceUrl] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(["/"])
  );

  // Labels for each selected path (editable)
  const [labels, setLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    sitemap.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allPages = useMemo(() => {
    if (!sitemap.data?.tree) return [];
    return collectPages(sitemap.data.tree);
  }, [sitemap.data?.tree]);

  const handleToggleSelect = useCallback(
    (path: string) => {
      setSelectedPaths((prev) => {
        const next = new Set(prev);
        if (next.has(path)) {
          next.delete(path);
        } else {
          next.add(path);
        }
        return next;
      });
      // Auto-set label if not already set
      setLabels((prev) => {
        if (prev[path]) return prev;
        return { ...prev, [path]: pathToLabel(path) };
      });
    },
    []
  );

  const handleToggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const newSet = new Set(allPages);
    setSelectedPaths(newSet);
    const newLabels: Record<string, string> = {};
    for (const p of allPages) {
      newLabels[p] = pathToLabel(p);
    }
    setLabels((prev) => ({ ...newLabels, ...prev }));
  }, [allPages]);

  const handleSelectNone = useCallback(() => {
    setSelectedPaths(new Set());
  }, []);

  const handleUpdateLabel = useCallback((path: string, label: string) => {
    setLabels((prev) => ({ ...prev, [path]: label }));
  }, []);

  const handleRemove = useCallback((path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      next.delete(path);
      return next;
    });
  }, []);

  const handleCreateAll = () => {
    if (selectedPaths.size === 0 || !sourceUrl.trim()) return;
    const src = sourceUrl.trim();
    bulkCreate.mutate(
      {
        projectId,
        suggestions: [...selectedPaths].map((targetPath) => ({
          sourceUrlPattern: src,
          targetUrl: targetPath,
          targetLabel: labels[targetPath] || pathToLabel(targetPath),
        })),
      },
      {
        onSuccess: (data: any) => {
          onCreated(data.created + data.updated);
        },
      }
    );
  };

  const tree = sitemap.data?.tree;
  const isLoading = sitemap.isLoading || sitemap.isFetching;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Import from Sitemap
          </h3>
          {sitemap.data?.truncated && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <AlertTriangle className="h-3 w-3" />
              Showing first 1000 of {sitemap.data.totalUrls} URLs
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sitemap.refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : sitemap.isError ? (
        <div className="p-6 text-center">
          <p className="text-sm text-red-400 mb-2">
            {sitemap.error?.message || "Failed to fetch sitemap"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sitemap.refetch()}
          >
            Try Again
          </Button>
        </div>
      ) : tree && tree.children.length === 0 ? (
        <div className="p-6 text-center">
          <Globe className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400 mb-1">
            No sitemap found at{" "}
            <span className="text-zinc-300 font-mono text-xs">
              {sitemap.data?.sitemapUrl}
            </span>
          </p>
          <p className="text-xs text-zinc-600 mb-4">
            Make sure your site has a /sitemap.xml or a Sitemap entry in
            robots.txt
          </p>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Add Manually Instead
          </Button>
        </div>
      ) : tree ? (
        <>
          {/* Source page input */}
          <div className="px-4 py-3 border-b border-zinc-800 space-y-2">
            <label className="block text-xs font-medium text-zinc-400">
              Source page
              <span className="text-zinc-600 font-normal ml-1">
                (where these suggestions will appear)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="/orders"
                className="flex-1 h-8 px-3 text-sm bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors font-mono"
              />
              {/* Quick-pick from sitemap pages */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) setSourceUrl(e.target.value);
                }}
                className="h-8 px-2 text-xs bg-zinc-950 border border-zinc-700 text-zinc-400 focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="">Pick from sitemap</option>
                {allPages.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tree with select all/none */}
          <div className="border-b border-zinc-800">
            <div className="flex items-center justify-between px-4 py-2">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select target pages
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Select all
                </button>
                <span className="text-zinc-700">|</span>
                <button
                  onClick={handleSelectNone}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto overflow-x-hidden border-t border-zinc-800/50">
              <TreeNode
                node={tree}
                depth={0}
                selectedPaths={selectedPaths}
                onToggleSelect={handleToggleSelect}
                expandedPaths={expandedPaths}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          </div>

          {/* Selected items with editable labels */}
          {selectedPaths.size > 0 && (
            <div className="border-b border-zinc-800">
              <div className="px-4 py-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {selectedPaths.size} page{selectedPaths.size !== 1 ? "s" : ""}{" "}
                  selected
                </h4>
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-zinc-800/30">
                {[...selectedPaths].map((path) => (
                  <div
                    key={path}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <span className="text-xs font-mono text-zinc-500 truncate min-w-0 flex-1 max-w-[200px]">
                      {path}
                    </span>
                    <input
                      type="text"
                      value={labels[path] || ""}
                      onChange={(e) =>
                        handleUpdateLabel(path, e.target.value)
                      }
                      className="h-7 px-2 text-xs bg-zinc-950 border border-zinc-700 text-zinc-200 w-44 focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Label"
                    />
                    <button
                      onClick={() => handleRemove(path)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80">
            <p className="text-xs text-zinc-500">
              {selectedPaths.size > 0 && sourceUrl.trim()
                ? `${selectedPaths.size} suggestion${
                    selectedPaths.size !== 1 ? "s" : ""
                  } for ${sourceUrl.trim()}`
                : selectedPaths.size > 0
                ? "Set a source page above"
                : "Select pages from the tree"}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateAll}
              disabled={
                selectedPaths.size === 0 ||
                !sourceUrl.trim() ||
                bulkCreate.isPending
              }
            >
              {bulkCreate.isPending
                ? "Creating..."
                : `Create ${selectedPaths.size} Suggestion${
                    selectedPaths.size !== 1 ? "s" : ""
                  }`}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};
