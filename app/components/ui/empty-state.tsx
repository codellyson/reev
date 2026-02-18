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
          "py-16 px-8 bg-zinc-950 border border-zinc-800": isCard,
        },
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-6 flex items-center justify-center",
            isCompact ? "w-12 h-12 bg-zinc-800" : "w-16 h-16 bg-zinc-800",
            "text-zinc-400"
          )}
        >
          {icon}
        </div>
      )}

      <h3
        className={cn(
          "font-semibold text-white mb-3",
          isCompact ? "text-lg" : "text-xl"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-zinc-400 max-w-md leading-relaxed",
            isCompact ? "text-sm mb-6" : "text-base mb-8"
          )}
        >
          {description}
        </p>
      )}

      {steps && steps.length > 0 && (
        <div className="mb-8 max-w-md w-full">
          <div className="bg-zinc-900 border border-zinc-800 p-6 text-left">
            <h4 className="text-sm font-semibold text-white mb-4 font-mono uppercase tracking-wider">
              Get Started:
            </h4>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm text-zinc-400">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-semibold font-mono">
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
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors"
        >
          {helpLink.label}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
