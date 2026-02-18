"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/layout";
import { Button, useToast } from "@/app/components/ui";
import { useUpdateProject } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import { Save, Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const { success, error: showError } = useToast();
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
                className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-500"
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
                className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-500"
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

        {/* Tracker Configuration */}
        {selectedProject && (
          <div className="bg-zinc-950 border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-4 font-mono uppercase tracking-wider">
              Configuration Options
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Customize the tracker with data attributes. All features are enabled by default.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 p-4 font-mono text-xs text-zinc-100 overflow-x-auto mb-4">
              <pre className="whitespace-pre-wrap">{`<script src="${trackerUrl}"
        data-project-id="${selectedProject.id}"
        data-api-url="${apiUrl}"
        data-rage-click="true"
        data-dead-link="true"
        data-broken-image="true"
        data-form-frustration="true"
        data-popover="true"
        data-popover-theme="dark"
        data-max-popups="5"
        data-popover-cooldown="30000"
        data-debug="false">
</script>`}</pre>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                UX Issue Detection
              </h4>
              <div className="grid gap-2 text-xs">
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-rage-click</code>
                  <span className="text-zinc-400">Detect rapid repeated clicks on unresponsive elements (3+ clicks in 1.5s)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-dead-link</code>
                  <span className="text-zinc-400">Probe links when clicked to detect broken or unreachable URLs</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-broken-image</code>
                  <span className="text-zinc-400">Scan for images that fail to load (existing + dynamically added)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-form-frustration</code>
                  <span className="text-zinc-400">Detect repeated clear-and-retype cycles in form fields</span>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mt-4">
                Feedback Popover
              </h4>
              <div className="grid gap-2 text-xs">
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-popover</code>
                  <span className="text-zinc-400">Show inline feedback popovers when issues are detected</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-popover-theme</code>
                  <span className="text-zinc-400">Popover color theme: <code className="text-zinc-300">dark</code> or <code className="text-zinc-300">light</code></span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-max-popups</code>
                  <span className="text-zinc-400">Maximum feedback popovers per session (default: 5)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-popover-cooldown</code>
                  <span className="text-zinc-400">Milliseconds between popovers (default: 30000)</span>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mt-4">
                Debug
              </h4>
              <div className="grid gap-2 text-xs">
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">data-debug</code>
                  <span className="text-zinc-400">Log all events to console for debugging</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
