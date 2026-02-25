"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useFlows,
  useCreateFlowSuggestion,
  useUpdateFlowSuggestion,
  useDeleteFlowSuggestion,
  useUpdateFlowConfig,
  useDiscoverFlows,
} from "@/app/hooks/use-flows";
import { useProjectContext } from "@/app/providers/project-provider";
import { FlowAddModal } from "@/app/components/flows/flow-add-modal";
import { SitemapTreePanel } from "@/app/components/flows/sitemap-tree-panel";
import {
  EmptyState,
  Skeleton,
  ErrorBanner,
  Button,
  Badge,
  useToast,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import {
  Route,
  Plus,
  Trash2,
  Compass,
  Eye,
  EyeOff,
  ArrowRight,
  MousePointer,
  Sparkles,
  Globe,
} from "lucide-react";
import type { FlowSuggestion } from "@/types/api";

export default function FlowsPage() {
  const router = useRouter();
  const { selectedProject, projects, loading: projectsLoading } = useProjectContext();
  const toast = useToast();

  const [sourceFilter, setSourceFilter] = useState<"manual" | "auto" | "sitemap" | undefined>(undefined);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSitemapPanel, setShowSitemapPanel] = useState(false);

  const { suggestions, config, loading, error } = useFlows(
    sourceFilter ? { source: sourceFilter } : {}
  );

  const createSuggestion = useCreateFlowSuggestion();
  const updateSuggestion = useUpdateFlowSuggestion();
  const deleteSuggestion = useDeleteFlowSuggestion();
  const updateConfig = useUpdateFlowConfig();
  const discoverFlows = useDiscoverFlows();

  const handleAddSuggestion = (data: {
    sourceUrlPattern: string;
    targetUrl: string;
    targetLabel: string;
    priority: number;
  }) => {
    if (!selectedProject) return;
    createSuggestion.mutate(
      { projectId: selectedProject.id, ...data },
      {
        onSuccess: () => {
          toast.success("Suggestion added");
          setShowAddModal(false);
        },
        onError: (err: any) => toast.error(err.message),
      }
    );
  };

  const handleToggleActive = (suggestion: FlowSuggestion) => {
    updateSuggestion.mutate(
      { id: suggestion.id, isActive: !suggestion.is_active },
      {
        onSuccess: () => toast.success(suggestion.is_active ? "Suggestion disabled" : "Suggestion enabled"),
        onError: (err: any) => toast.error(err.message),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteSuggestion.mutate(id, {
      onSuccess: () => toast.success("Suggestion deleted"),
      onError: (err: any) => toast.error(err.message),
    });
  };

  const handleToggleEnabled = () => {
    if (!selectedProject) return;
    updateConfig.mutate(
      {
        projectId: selectedProject.id,
        enabled: !(config?.enabled ?? false),
        displayMode: config?.display_mode || "frustration",
        maxSuggestions: config?.max_suggestions ?? 20,
        widgetPosition: config?.widget_position || "bottom-right",
        widgetTheme: config?.widget_theme || "dark",
        autoDiscover: config?.auto_discover ?? true,
        minTransitionCount: config?.min_transition_count ?? 5,
      },
      {
        onSuccess: () =>
          toast.success(
            config?.enabled ? "Flow suggestions disabled" : "Flow suggestions enabled"
          ),
        onError: (err: any) => toast.error(err.message),
      }
    );
  };

  const handleModeChange = (mode: "frustration" | "always") => {
    if (!selectedProject) return;
    updateConfig.mutate(
      {
        projectId: selectedProject.id,
        enabled: config?.enabled ?? false,
        displayMode: mode,
        maxSuggestions: config?.max_suggestions ?? 20,
        widgetPosition: config?.widget_position || "bottom-right",
        widgetTheme: config?.widget_theme || "dark",
        autoDiscover: config?.auto_discover ?? true,
        minTransitionCount: config?.min_transition_count ?? 5,
      },
      {
        onSuccess: () => toast.success(`Display mode set to ${mode}`),
        onError: (err: any) => toast.error(err.message),
      }
    );
  };

  const handlePositionChange = (position: string) => {
    if (!selectedProject) return;
    updateConfig.mutate(
      {
        projectId: selectedProject.id,
        enabled: config?.enabled ?? false,
        displayMode: config?.display_mode || "frustration",
        maxSuggestions: config?.max_suggestions ?? 20,
        widgetPosition: position,
        widgetTheme: config?.widget_theme || "dark",
        autoDiscover: config?.auto_discover ?? true,
        minTransitionCount: config?.min_transition_count ?? 5,
      },
      {
        onSuccess: () => toast.success(`Position updated`),
        onError: (err: any) => toast.error(err.message),
      }
    );
  };

  const handleDiscover = () => {
    if (!selectedProject) return;
    discoverFlows.mutate(selectedProject.id, {
      onSuccess: (data: any) => {
        toast.success(
          `Discovered ${data.created} new paths, updated ${data.updated} existing`
        );
      },
      onError: (err: any) => toast.error(err.message),
    });
  };

  // Group suggestions by source URL
  const grouped = suggestions.reduce<Record<string, FlowSuggestion[]>>(
    (acc, s) => {
      const key = s.source_url_pattern;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {}
  );

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Flows"
          description="Select or create a project to manage navigation suggestions"
        />
        <EmptyState
          icon={<Route className="h-8 w-8" />}
          title="No project selected"
          description={
            projects.length === 0
              ? "Create your first project to start setting up flows"
              : "Please select a project from the switcher above"
          }
          action={
            projects.length === 0
              ? { label: "Create Project", onClick: () => router.push("/projects/new") }
              : undefined
          }
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Flows"
        description="Guide users to the right place when they're lost"
        breadcrumbs={[{ label: "Flows" }]}
      />

      {/* Config Panel */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Navigation Suggestions
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Show contextual navigation hints to users on your site
            </p>
          </div>
          <button
            onClick={handleToggleEnabled}
            disabled={updateConfig.isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config?.enabled
                ? "bg-orange-500"
                : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config?.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {config?.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Display Mode
              </label>
              <div className="flex gap-2">
                {(["frustration", "always"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors capitalize ${
                      config?.display_mode === mode
                        ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                        : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {mode === "frustration" ? "On Frustration" : "Always On"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Widget Position
              </label>
              <div className="flex gap-2">
                {["bottom-right", "bottom-left"].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => handlePositionChange(pos)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      (config?.widget_position || "bottom-right") === pos
                        ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                        : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {pos.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {([undefined, "manual", "auto", "sitemap"] as const).map((filter) => (
            <button
              key={filter ?? "all"}
              onClick={() => setSourceFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
                sourceFilter === filter
                  ? "bg-orange-500 text-zinc-900 border-orange-500"
                  : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
              }`}
            >
              {filter === undefined
                ? "All"
                : filter === "manual"
                ? "Manual"
                : filter === "auto"
                ? "Auto-discovered"
                : "Sitemap"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDiscover}
            disabled={discoverFlows.isPending}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {discoverFlows.isPending ? "Discovering..." : "Discover Paths"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSitemapPanel(!showSitemapPanel)}
          >
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            Import Sitemap
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Suggestion
          </Button>
        </div>
      </div>

      {/* Sitemap Import Panel */}
      {showSitemapPanel && (
        <SitemapTreePanel
          projectId={selectedProject.id}
          onClose={() => setShowSitemapPanel(false)}
          onCreated={(count) => {
            toast.success(`Created ${count} suggestion${count !== 1 ? "s" : ""} from sitemap`);
            setShowSitemapPanel(false);
          }}
        />
      )}

      {/* Error */}
      {error && <ErrorBanner title="Failed to load flows" message={error} />}

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800">
          <EmptyState
            icon={<Route className="h-8 w-8" />}
            title="No flow suggestions yet"
            description='Add manual suggestions for specific pages or click "Discover Paths" to auto-detect common navigation patterns from your user sessions.'
            action={{
              label: "Add Suggestion",
              onClick: () => setShowAddModal(true),
            }}
            variant="compact"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([sourceUrl, items]) => (
            <div
              key={sourceUrl}
              className="bg-zinc-900/50 border border-zinc-800 overflow-hidden"
            >
              <div className="px-3 sm:px-4 py-3 border-b border-zinc-800 flex items-center gap-2 min-w-0">
                <Compass className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                <span className="text-sm font-medium text-zinc-300 truncate">
                  {sourceUrl}
                </span>
                <Badge variant="default" size="sm" className="flex-shrink-0">
                  {items.length} suggestion{items.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {items.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 ${
                      !suggestion.is_active ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ArrowRight className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-zinc-200 truncate">
                          {suggestion.target_label}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">
                          {suggestion.target_url}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 pl-6 sm:pl-0">
                      <Badge
                        variant={
                          suggestion.source === "manual"
                            ? "info"
                            : suggestion.source === "sitemap"
                            ? "success"
                            : "default"
                        }
                        size="sm"
                      >
                        {suggestion.source}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        <MousePointer className="h-3 w-3 inline mr-0.5" />
                        {suggestion.click_count}
                      </span>
                      <button
                        onClick={() => handleToggleActive(suggestion)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                        title={
                          suggestion.is_active
                            ? "Disable suggestion"
                            : "Enable suggestion"
                        }
                      >
                        {suggestion.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(suggestion.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete suggestion"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <FlowAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSuggestion}
        submitting={createSuggestion.isPending}
      />
    </div>
  );
}
