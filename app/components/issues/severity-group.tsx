"use client";

import React from "react";

interface SeverityGroupProps {
  severity: string;
  count: number;
  children: React.ReactNode;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-amber-400",
  low: "text-blue-400",
};

export const SeverityGroup: React.FC<SeverityGroupProps> = ({
  severity,
  count,
  children,
}) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2
          className={`text-xs font-semibold font-mono uppercase tracking-wider ${SEVERITY_COLORS[severity] || "text-zinc-400"}`}
        >
          {severity}
        </h2>
        <span className="text-xs text-zinc-600 font-mono">
          {count} {count === 1 ? "issue" : "issues"}
        </span>
        <div className="flex-1 border-t border-zinc-800/50" />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
};
