import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
}) => {
  const baseStyles = "inline-flex items-center rounded-sm font-medium";

  const variants = {
    default: "bg-gray-100 text-gray-900",
    success: "bg-[#E8F5E9] text-[#2E7D32]",
    warning: "bg-[#FFF3E0] text-[#E65100]",
    error: "bg-[#FFEBEE] text-[#C62828]",
    info: "bg-gray-100 text-gray-900",
  };

  const sizes = {
    sm: "h-5 px-2 text-xs",
    md: "h-5 px-2 text-xs",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

