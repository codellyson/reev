"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { FormField, Input } from "@/app/components/ui/form-field";
import { PageHeader } from "@/app/components/layout";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          website_url: websiteUrl.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create project");
        setLoading(false);
        return;
      }

      router.push("/setup");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <PageHeader
            title="Create New Project"
            description="Set up a new project to start tracking UX insights"
          />

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <FormField label="Project Name" required error={error}>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Website"
                    required
                    disabled={loading}
                    autoComplete="off"
                  />
                </FormField>
                <FormField label="Website URL" required>
                  <Input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    disabled={loading}
                    autoComplete="off"
                  />
                </FormField>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !name.trim() || !websiteUrl.trim()}
                >
                  {loading ? "Creating..." : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
