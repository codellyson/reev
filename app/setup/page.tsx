"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function SetupPage() {
  const [copied, setCopied] = useState(false);
  const projectId = "abc123";
  const trackerUrl = typeof window !== "undefined" ? `${window.location.origin}/tracker.js` : "/tracker.js";
  const trackingCode = `<script src="${trackerUrl}" data-project-id="${projectId}" data-api-url="${typeof window !== "undefined" ? window.location.origin : ""}"></script>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8 transition-base">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-black mb-2">
            Setup Tracking
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Add this code to your website to start recording sessions
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-black uppercase tracking-wider">
                Your Project ID
              </h2>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 font-mono text-sm text-black select-all">
              {projectId}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-black uppercase tracking-wider">
                Tracking Code
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
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
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 font-mono text-xs text-black overflow-x-auto select-all">
              <pre className="whitespace-pre-wrap">{trackingCode}</pre>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-4">
              Installation Steps
            </h2>
            <ol className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <span>Copy the tracking code above</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <span>Paste it before the <code className="bg-gray-100 px-1 rounded">{"</body>"}</code> tag in your HTML</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <span>Deploy your website</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                  4
                </span>
                <span>Check your dashboard - sessions will appear within 30 seconds</span>
              </li>
            </ol>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="primary">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

