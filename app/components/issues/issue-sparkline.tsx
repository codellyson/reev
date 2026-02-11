"use client";

import React from "react";

interface SparklineProps {
  data: Array<{ value: number }>;
  trend: string;
  width?: number;
  height?: number;
}

const TREND_COLORS: Record<string, string> = {
  worsening: "#ef4444",
  improving: "#10b981",
  stable: "#71717a",
  new: "#3b82f6",
};

export const IssueSparkline: React.FC<SparklineProps> = ({
  data,
  trend,
  width = 80,
  height = 24,
}) => {
  if (!data || data.length < 2) return null;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * innerW;
      const y = padding + innerH - ((v - min) / range) * innerH;
      return `${x},${y}`;
    })
    .join(" ");

  const color = TREND_COLORS[trend] || TREND_COLORS.stable;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
