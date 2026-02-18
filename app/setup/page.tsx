"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useProjectContext } from "@/app/providers/project-provider";
import { Skeleton } from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import { EmptyState } from "@/app/components/ui";

export default function SetupPage() {
  const [copied, setCopied] = useState(false);
  const { selectedProject: project, loading } = useProjectContext();
  const error = !project && !loading ? "No project selected" : null;

  const trackerUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/reev.js`
      : "/reev.js";
  const apiUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const trackingCode = project
    ? `<script src="${trackerUrl}" data-project-id="${project.id}" data-api-url="${apiUrl}"></script>`
    : "";

  const handleCopy = async () => {
    if (!trackingCode) return;
    await navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
            <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
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
                  onClick: () => window.location.href = "/projects/new",
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

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                Your Project ID
              </h2>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm text-zinc-100 select-all break-all">
              {project.id}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              This ID identifies your project in the tracking code.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                Tracking Code
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
                disabled={!trackingCode}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-zinc-100 overflow-x-auto select-all">
              <pre className="whitespace-pre-wrap">{trackingCode}</pre>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono mb-4">
              Installation Steps
            </h2>
            <ol className="space-y-4 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </span>
                <span>Copy the tracking code above</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                <span>
                  Paste it before the{" "}
                  <code className="bg-zinc-800 px-1 text-zinc-200">{"</body>"}</code> tag
                  in your HTML
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">
                  3
                </span>
                <span>Deploy your website</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">
                  4
                </span>
                <span>
                  Check your dashboard - events will appear within 30 seconds
                </span>
              </li>
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
