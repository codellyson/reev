"use client";

import React, { useState } from "react";
import { PageHeader } from "@/app/components/layout";
import { Button, useToast } from "@/app/components/ui";
import { TagManager } from "@/app/components/sessions";
import { useTags, useCreateTag, useDeleteTag } from "@/app/hooks";
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

  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    projectName: "My Website",
    projectDomain: "example.com",
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

  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(settings.apiKey);
    setCopied(true);
    success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings);
    success("Settings saved successfully");
  };

  const handleResetApiKey = () => {
    if (confirm("Are you sure you want to reset your API key? This will invalidate the current key.")) {
      // Reset API key logic here
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
          <Button variant="primary" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 sticky top-20">
            <nav className="space-y-1">
              <a
                href="#general"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg transition-colors"
              >
                <Shield className="h-4 w-4" />
                General
              </a>
              <a
                href="#privacy"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                Privacy
              </a>
              <a
                href="#notifications"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </a>
              <a
                href="#api"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Key className="h-4 w-4" />
                API Keys
              </a>
              <a
                href="#tags"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Tag className="h-4 w-4" />
                Tags
              </a>
              <a
                href="#team"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
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
          <div id="general" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-bold text-black mb-6">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={settings.projectName}
                  onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Domain
                </label>
                <input
                  type="text"
                  value={settings.projectDomain}
                  onChange={(e) => setSettings({ ...settings, projectDomain: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sessions will only be recorded from this domain
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Retention (days)
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Sessions older than this will be automatically deleted
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div id="privacy" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-bold text-black mb-6">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">Record IP Addresses</p>
                  <p className="text-xs text-gray-600 mt-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">Mask Sensitive Data</p>
                  <p className="text-xs text-gray-600 mt-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">Record Console Logs</p>
                  <p className="text-xs text-gray-600 mt-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">Record Network Requests</p>
                  <p className="text-xs text-gray-600 mt-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notifications" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-bold text-black mb-6">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">Email Notifications</p>
                  <p className="text-xs text-gray-600 mt-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">Error Alerts</p>
                  <p className="text-xs text-gray-600 mt-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">Weekly Reports</p>
                  <p className="text-xs text-gray-600 mt-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div id="api" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-bold text-black mb-6">API Keys</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Live API Key</p>
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
                <code className="text-sm font-mono text-black">
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
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
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
          <div id="team" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-black">Team Members</h3>
              <Button variant="primary" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">AN</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Analyst</p>
                    <p className="text-xs text-gray-600">analyst@example.com</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
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
