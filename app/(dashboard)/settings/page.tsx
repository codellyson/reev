"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/layout";
import { Button, useToast } from "@/app/components/ui";
import { TagManager } from "@/app/components/sessions";
import { useTags, useCreateTag, useDeleteTag, useUpdateProject } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import { Save, Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const { success, error: showError } = useToast();
  const { data: tags = [] } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const { selectedProject, setSelectedProject } = useProjectContext();
  const updateProject = useUpdateProject();

  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    projectName: "",
    projectDomain: "",
  });

  useEffect(() => {
    if (selectedProject) {
      setSettings({
        projectName: selectedProject.name,
        projectDomain: selectedProject.website_url.replace(/^https?:\/\//, ""),
      });
    }
  }, [selectedProject]);

  const trackerUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tracker.js`
      : "/tracker.js";
  const apiUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const trackingCode = selectedProject
    ? `<script src="${trackerUrl}" data-project-id="${selectedProject.id}" data-api-url="${apiUrl}"></script>`
    : "";

  const handleCopyCode = async () => {
    if (!trackingCode) return;
    await navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    success("Tracking code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!selectedProject) {
      showError("No project selected");
      return;
    }
    if (!settings.projectName.trim()) {
      showError("Project name is required");
      return;
    }
    if (!settings.projectDomain.trim()) {
      showError("Project domain is required");
      return;
    }

    try {
      const updated = await updateProject.mutateAsync({
        id: selectedProject.id,
        name: settings.projectName.trim(),
        website_url: settings.projectDomain.trim(),
      });
      setSelectedProject(updated);
      success("Settings saved successfully");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to save settings"
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your project configuration"
        breadcrumbs={[{ label: "Settings" }]}
        actions={
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={updateProject.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProject.isPending ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-zinc-950 border border-zinc-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">
            General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={settings.projectName}
                onChange={(e) =>
                  setSettings({ ...settings, projectName: e.target.value })
                }
                className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-zinc-500"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Project Domain
              </label>
              <input
                type="text"
                value={settings.projectDomain}
                onChange={(e) =>
                  setSettings({ ...settings, projectDomain: e.target.value })
                }
                className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-zinc-500"
                placeholder="example.com"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Sessions will only be recorded from this domain
              </p>
            </div>
          </div>
        </div>

        {/* Tracker Setup */}
        <div className="bg-zinc-950 border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Tracker Setup
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              disabled={!trackingCode}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {selectedProject ? (
            <>
              <div className="bg-zinc-900 border border-zinc-800 p-4 font-mono text-xs text-zinc-100 overflow-x-auto select-all">
                <pre className="whitespace-pre-wrap">{trackingCode}</pre>
              </div>
              <p className="text-xs text-zinc-500 mt-3">
                Add this script before the <code className="bg-zinc-800 px-1 text-zinc-200">{"</body>"}</code> tag in your HTML. Events will appear within 30 seconds.
              </p>
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              Select a project to see the tracking code.
            </p>
          )}
        </div>

        {/* Tag Management */}
        <div className="bg-zinc-950 border border-zinc-800 p-6">
          <TagManager
            tags={tags}
            onTagCreate={async (name, color) => {
              try {
                await createTag.mutateAsync({ name, color });
                success("Tag created successfully");
              } catch (err) {
                showError("Failed to create tag");
                throw err;
              }
            }}
            onTagDelete={async (tagId) => {
              try {
                await deleteTag.mutateAsync(tagId);
                success("Tag deleted successfully");
              } catch (err) {
                showError("Failed to delete tag");
                throw err;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
