"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorBannerProps {
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title,
  message,
  dismissible = true,
  onDismiss,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-red-500/10 border-l-4 border-red-500 p-4",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-400 mb-1">{title}</h4>
          {message && <p className="text-sm text-red-400/80">{message}</p>}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-red-500/20 transition-base"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
};
