"use client";

import React, { Suspense } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface MetricChartProps {
  data: { date: string; value: number }[];
  type: "line" | "bar" | "area";
  label?: string;
  color?: string;
  height?: number;
}

export const MetricChart: React.FC<MetricChartProps> = ({
  data,
  type,
  label,
  color = "#10b981",
  height = 300,
}) => {
  const chartConfig = {
    grid: { stroke: "#27272a" },
    tooltip: {
      backgroundColor: "#18181b",
      border: "1px solid #3f3f46",
      borderRadius: "0px",
      padding: "8px 12px",
      boxShadow: "none",
    },
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 10, left: 0, bottom: 5 },
    };

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartConfig.grid.stroke}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#a1a1aa" }}
              stroke="#27272a"
            />
            <YAxis tick={{ fontSize: 12, fill: "#a1a1aa" }} stroke="#27272a" />
            <Tooltip
              contentStyle={chartConfig.tooltip}
              labelStyle={{ color: "#f4f4f5" }}
              itemStyle={{ color: "#f4f4f5" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartConfig.grid.stroke}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#a1a1aa" }}
              stroke="#27272a"
            />
            <YAxis tick={{ fontSize: 12, fill: "#a1a1aa" }} stroke="#27272a" />
            <Tooltip
              contentStyle={chartConfig.tooltip}
              labelStyle={{ color: "#f4f4f5" }}
              itemStyle={{ color: "#f4f4f5" }}
            />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartConfig.grid.stroke}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#a1a1aa" }}
              stroke="#27272a"
            />
            <YAxis tick={{ fontSize: 12, fill: "#a1a1aa" }} stroke="#27272a" />
            <Tooltip
              contentStyle={chartConfig.tooltip}
              labelStyle={{ color: "#f4f4f5" }}
              itemStyle={{ color: "#f4f4f5" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.15}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="w-full">
      {label && (
        <h3 className="text-sm font-semibold text-white mb-4 font-mono uppercase tracking-wider">{label}</h3>
      )}
      <Suspense
        fallback={
          <div
            className="flex items-center justify-center bg-zinc-900 border border-zinc-800"
            style={{ height }}
            aria-label="Loading chart"
          >
            <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </Suspense>
    </div>
  );
};
