"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  filename?: string;
  showCopyButton?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  filename,
  showCopyButton = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("bg-zinc-950 border border-zinc-800 overflow-hidden", className)}
    >
      {(filename || showCopyButton) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          {filename ? (
            <span className="text-xs text-zinc-500 font-mono">{filename}</span>
          ) : (
            <span />
          )}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs text-zinc-100 whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </div>
  );
}
