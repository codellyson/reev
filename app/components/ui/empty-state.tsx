import React from "react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  helpLink?: {
    label: string;
    href: string;
  };
  steps?: string[];
  variant?: "default" | "compact" | "card";
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  helpLink,
  steps,
  variant = "default",
  className,
}) => {
  const isCompact = variant === "compact";
  const isCard = variant === "card";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        {
          "py-20 px-4": variant === "default",
          "py-12 px-4": isCompact,
          "py-16 px-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm":
            isCard,
        },
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-6 flex items-center justify-center rounded-full",
            isCompact ? "w-12 h-12 bg-gray-100 dark:bg-gray-700" : "w-16 h-16 bg-gray-100 dark:bg-gray-700",
            "text-gray-400 dark:text-gray-500"
          )}
        >
          {icon}
        </div>
      )}

      <h3
        className={cn(
          "font-semibold text-gray-900 dark:text-white mb-3",
          isCompact ? "text-lg" : "text-xl"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-gray-600 dark:text-gray-400 max-w-md leading-relaxed",
            isCompact ? "text-sm mb-6" : "text-base mb-8"
          )}
        >
          {description}
        </p>
      )}

      {steps && steps.length > 0 && (
        <div className="mb-8 max-w-md w-full">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-left">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Get Started:
            </h4>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button
              variant={action.variant || "primary"}
              onClick={action.onClick}
              className="min-w-[140px]"
            >
              {action.icon}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}

      {helpLink && (
        <a
          href={helpLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {helpLink.label}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};

