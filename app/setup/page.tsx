"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Skeleton, EmptyState, Tabs, CodeBlock } from "@/app/components/ui";
import { useProjectContext } from "@/app/providers/project-provider";
import { PageHeader } from "@/app/components/layout";
import { frameworkSnippets } from "./framework-snippets";

const frameworkTabs = frameworkSnippets.map((s) => ({
  id: s.id,
  label: s.label,
}));

export default function SetupPage() {
  const [activeFramework, setActiveFramework] = useState("html");
  const [origin, setOrigin] = useState("");
  const { selectedProject: project, loading } = useProjectContext();
  const error = !project && !loading ? "No project selected" : null;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const trackerUrl = origin ? `${origin}/reev.js` : "/reev.js";
  const apiUrl = origin;

  const activeSnippet = useMemo(
    () => frameworkSnippets.find((s) => s.id === activeFramework)!,
    [activeFramework]
  );

  const code = useMemo(
    () => (project ? activeSnippet.getCode(project.id, trackerUrl, apiUrl) : ""),
    [project, activeSnippet, trackerUrl, apiUrl]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
            <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-16" />
                ))}
              </div>
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <PageHeader
              title="Setup Tracking"
              description="Get your tracking code to start collecting UX insights"
            />
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <EmptyState
                title="No project found"
                description="Create a project to get started with tracking"
                action={{
                  label: "Create Project",
                  onClick: () => (window.location.href = "/projects/new"),
                }}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <PageHeader
            title="Setup Tracking"
            description={`Add this code to ${project.website_url} to start collecting UX insights`}
          />

          {/* Project ID */}
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono mb-4">
              Your Project ID
            </h2>
            <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm text-zinc-100 select-all break-all">
              {project.id}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              This ID identifies your project in the tracking code.
            </p>
          </div>

          {/* Tracking Code */}
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono mb-4">
              Tracking Code
            </h2>
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
            <p className="text-xs text-zinc-500 mt-3">{activeSnippet.note}</p>
          </div>

          {/* Installation Steps */}
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono mb-4">
              Installation Steps
            </h2>
            <ol className="space-y-4 text-sm text-zinc-400">
              {activeSnippet.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">
                    {i + 1}
                  </span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/issues">
              <Button variant="primary">
                View Issues
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
