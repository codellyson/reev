"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/app/components/layout";
import { Button, useToast, Tabs, CodeBlock } from "@/app/components/ui";
import { useUpdateProject } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import { Save } from "lucide-react";
import { frameworkSnippets } from "@/app/setup/framework-snippets";

const frameworkTabs = frameworkSnippets.map((s) => ({
  id: s.id,
  label: s.label,
}));

export default function SettingsPage() {
  const { success, error: showError } = useToast();
  const { selectedProject, setSelectedProject } = useProjectContext();
  const updateProject = useUpdateProject();

  const [activeFramework, setActiveFramework] = useState("html");
  const [origin, setOrigin] = useState("");
  const [settings, setSettings] = useState({
    projectName: "",
    projectDomain: "",
  });

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setSettings({
        projectName: selectedProject.name,
        projectDomain: selectedProject.website_url.replace(/^https?:\/\//, ""),
      });
    }
  }, [selectedProject]);

  const trackerUrl = origin ? `${origin}/reev.js` : "/reev.js";
  const apiUrl = origin;

  const activeSnippet = useMemo(
    () => frameworkSnippets.find((s) => s.id === activeFramework)!,
    [activeFramework]
  );

  const code = useMemo(
    () =>
      selectedProject
        ? activeSnippet.getCode(selectedProject.id, trackerUrl, apiUrl)
        : "",
    [selectedProject, activeSnippet, trackerUrl, apiUrl]
  );

  const configCode = useMemo(
    () =>
      selectedProject
        ? [
            "<script>",
            "!function(c, s) {",
            "  window.ReevConfig = c;",
            '  s = document.createElement("script");',
            `  s.src = "${trackerUrl}";`,
            "  document.head.appendChild(s);",
            "}({",
            `  projectId: "${selectedProject.id}",`,
            `  apiUrl: "${apiUrl}",`,
            "  rageClick: true,",
            "  deadLink: true,",
            "  brokenImage: true,",
            "  formFrustration: true,",
            "  popover: true,",
            '  popoverTheme: "dark",',
            "  debug: false",
            "});",
            "</script>",
          ].join("\n")
        : "",
    [selectedProject, trackerUrl, apiUrl]
  );

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
          <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider mb-4">
            Tracker Setup
          </h3>

          {selectedProject ? (
            <>
              <Tabs
                tabs={frameworkTabs}
                activeTab={activeFramework}
                onTabChange={setActiveFramework}
                size="sm"
                className="mb-4"
              />
              <CodeBlock
                key={activeFramework}
                code={code}
                filename={activeSnippet.filename}
              />
              <p className="text-xs text-zinc-500 mt-3">
                {activeSnippet.note}
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
              Customize the tracker with a config object. All features are enabled by default.
            </p>

            <CodeBlock code={configCode} filename="Full config example" className="mb-4" />

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Config Options
              </h4>
              <div className="grid gap-2 text-xs">
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">rageClick</code>
                  <span className="text-zinc-400">Detect rapid repeated clicks on unresponsive elements (default: true)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">deadLink</code>
                  <span className="text-zinc-400">Probe same-origin links to detect broken URLs (default: true)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">brokenImage</code>
                  <span className="text-zinc-400">Detect images that fail to load (default: true)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">formFrustration</code>
                  <span className="text-zinc-400">Detect repeated clear-and-retype in form fields (default: true)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">popover</code>
                  <span className="text-zinc-400">Show inline feedback popovers on detected issues (default: true)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">popoverTheme</code>
                  <span className="text-zinc-400"><code className="text-zinc-300">&quot;dark&quot;</code> or <code className="text-zinc-300">&quot;light&quot;</code> (default: dark)</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-zinc-900/50 border border-zinc-800/50">
                  <code className="text-orange-400 shrink-0">debug</code>
                  <span className="text-zinc-400">Log all events to console (default: false)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
