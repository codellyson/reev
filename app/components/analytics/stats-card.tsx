import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  comparison?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  change,
  comparison,
  trend,
  className,
}) => {
  const formatChange = (changeValue?: number) => {
    if (changeValue === undefined) return null;
    const sign = changeValue >= 0 ? "+" : "";
    return `${sign}${changeValue.toFixed(1)}%`;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-error" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-error";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-700 border border-gray-200">
            {icon}
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-black leading-tight mb-1">{value}</div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1.5 mt-2", getChangeColor())}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{formatChange(change)}</span>
          </div>
        )}
      </div>
      {comparison && (
        <p className="text-sm text-gray-600 mt-3">{comparison}</p>
      )}
    </div>
  );
};

