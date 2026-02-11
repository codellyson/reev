import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

    const variants = {
      primary: "bg-emerald-500 text-zinc-900 border border-transparent hover:bg-emerald-400",
      secondary: "bg-zinc-900 text-zinc-100 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600",
      ghost: "bg-transparent text-zinc-400 border-none hover:bg-zinc-900 hover:text-white",
      danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
