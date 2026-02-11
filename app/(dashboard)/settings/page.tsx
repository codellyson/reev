"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/layout";
import { Button, useToast } from "@/app/components/ui";
import { TagManager } from "@/app/components/sessions";
import { useTags, useCreateTag, useDeleteTag, useUpdateProject } from "@/app/hooks";
import { useProjectContext } from "@/app/providers/project-provider";
import {
  Save,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Bell,
  Users,
  Key,
  Tag,
} from "lucide-react";

export default function SettingsPage() {
  const { success, error: showError } = useToast();
  const { data: tags = [] } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const { selectedProject, setSelectedProject } = useProjectContext();
  const updateProject = useUpdateProject();

  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    projectName: "",
    projectDomain: "",
    apiKey: "sk_live_1234567890abcdef",
    dataRetention: 30,
    recordIPs: false,
    recordConsole: true,
    recordNetwork: true,
    maskSensitiveData: true,
    emailNotifications: true,
    errorNotifications: true,
    weeklyReport: false,
  });

  useEffect(() => {
    if (selectedProject) {
      setSettings((prev) => ({
        ...prev,
        projectName: selectedProject.name,
        projectDomain: selectedProject.website_url.replace(/^https?:\/\//, ""),
      }));
    }
  }, [selectedProject]);

  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(settings.apiKey);
    setCopied(true);
    success("API key copied to clipboard");
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

  const handleResetApiKey = () => {
    if (confirm("Are you sure you want to reset your API key? This will invalidate the current key.")) {
      console.log("Resetting API key");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your project configuration and preferences"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 p-2 sticky top-20">
            <nav className="space-y-1">
              <a
                href="#general"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-zinc-800 transition-colors"
              >
                <Shield className="h-4 w-4" />
                General
              </a>
              <a
                href="#privacy"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Privacy
              </a>
              <a
                href="#notifications"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </a>
              <a
                href="#api"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Key className="h-4 w-4" />
                API Keys
              </a>
              <a
                href="#tags"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Tag className="h-4 w-4" />
                Tags
              </a>
              <a
                href="#team"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Users className="h-4 w-4" />
                Team
              </a>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div id="general" className="bg-zinc-950 border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={settings.projectName}
                  onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
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
                  onChange={(e) => setSettings({ ...settings, projectDomain: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-zinc-500"
                  placeholder="example.com"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Sessions will only be recorded from this domain
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Data Retention (days)
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
                <p className="text-xs text-zinc-500 mt-1">
                  Sessions older than this will be automatically deleted
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div id="privacy" className="bg-zinc-950 border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Record IP Addresses</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Store user IP addresses with sessions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.recordIPs}
                    onChange={(e) => setSettings({ ...settings, recordIPs: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Mask Sensitive Data</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Automatically mask passwords, credit cards, and sensitive fields
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maskSensitiveData}
                    onChange={(e) => setSettings({ ...settings, maskSensitiveData: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Record Console Logs</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Capture console.log, warn, and error messages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.recordConsole}
                    onChange={(e) => setSettings({ ...settings, recordConsole: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Record Network Requests</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Track API calls and network activity
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.recordNetwork}
                    onChange={(e) => setSettings({ ...settings, recordNetwork: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notifications" className="bg-zinc-950 border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Email Notifications</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Receive email updates about your project
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Error Alerts</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Get notified when errors are detected
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.errorNotifications}
                    onChange={(e) => setSettings({ ...settings, errorNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Weekly Reports</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Receive weekly analytics summary
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weeklyReport}
                    onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div id="api" className="bg-zinc-950 border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-6 font-mono uppercase tracking-wider">API Keys</h3>
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-zinc-300">Live API Key</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyApiKey}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <code className="text-sm font-mono text-zinc-100">
                  {showApiKey ? settings.apiKey : "sk_live_••••••••••••••••"}
                </code>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetApiKey}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset API Key
              </Button>
            </div>
          </div>

          {/* Tag Management */}
          <div
            id="tags"
            className="bg-zinc-950 border border-zinc-800 p-6"
          >
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

          {/* Team Management */}
          <div id="team" className="bg-zinc-950 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Team Members</h3>
              <Button variant="primary" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
                    <span className="text-zinc-900 font-semibold text-sm">AN</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">Analyst</p>
                    <p className="text-xs text-zinc-400">analyst@example.com</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-3 py-1">
                  Owner
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
