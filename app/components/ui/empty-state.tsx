import React from "react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-6 text-gray-300">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 max-w-md mb-8 leading-relaxed">{description}</p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

