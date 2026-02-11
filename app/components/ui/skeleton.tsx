import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: "pulse" | "shimmer" | "wave";
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  variant = "pulse",
  style,
}) => {
  return (
    <div
      className={cn(
        "bg-zinc-800 relative overflow-hidden",
        {
          "animate-pulse": variant === "pulse",
          "animate-shimmer": variant === "shimmer",
          "animate-wave": variant === "wave",
        },
        className
      )}
      style={{ width, height, ...style }}
    >
      {variant === "shimmer" && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />
      )}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("bg-zinc-950 border border-zinc-800 p-6", className)}>
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-zinc-800">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({
  items = 3,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("bg-zinc-950 border border-zinc-800 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex items-end justify-between h-48 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full"
            style={{ height: `${Math.random() * 100 + 50}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
};

export const SkeletonSessionRow: React.FC = () => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-4 transition-colors">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonStats: React.FC<{ cards?: number }> = ({ cards = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-zinc-950 p-6">
          <Skeleton className="h-4 w-20 mb-4" />
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonPlayerFrame: React.FC = () => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 aspect-video flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md px-8">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
};
