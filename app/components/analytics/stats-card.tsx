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
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-zinc-500" />;
    }
  };

  const getChangeColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-400";
      case "down":
        return "text-red-400";
      default:
        return "text-zinc-500";
    }
  };

  return (
    <div
      className={cn(
        "bg-zinc-950 border border-zinc-800 p-6 hover:bg-zinc-900/50 transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          {label}
        </span>
        {icon && (
          <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-emerald-400 border border-zinc-800">
            {icon}
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-white leading-tight mb-1">{value}</div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1.5 mt-2", getChangeColor())}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{formatChange(change)}</span>
          </div>
        )}
      </div>
      {comparison && (
        <p className="text-sm text-zinc-400 mt-3">{comparison}</p>
      )}
    </div>
  );
};
