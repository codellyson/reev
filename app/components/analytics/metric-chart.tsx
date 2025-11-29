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
  color = "#2563eb",
  height = 300,
}) => {
  const chartConfig = {
    grid: { stroke: "#e5e7eb" },
    tooltip: {
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#d1d5db"
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#d1d5db" />
            <Tooltip contentStyle={chartConfig.tooltip} />
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
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#d1d5db"
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#d1d5db" />
            <Tooltip contentStyle={chartConfig.tooltip} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
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
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#d1d5db"
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#d1d5db" />
            <Tooltip contentStyle={chartConfig.tooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.2}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="w-full">
      {label && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{label}</h3>
      )}
      <Suspense
        fallback={
          <div
            className="flex items-center justify-center bg-gray-50 rounded-lg"
            style={{ height }}
            aria-label="Loading chart"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent" />
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
