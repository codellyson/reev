import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

    const variants = {
      primary: "bg-black text-white border border-transparent hover:bg-gray-900",
      secondary: "bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-black",
      ghost: "bg-transparent text-gray-600 border-none hover:bg-gray-100 hover:text-black",
      danger: "bg-error text-white border-none hover:bg-[#E60000]",
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

