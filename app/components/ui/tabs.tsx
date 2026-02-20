import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  size?: "sm" | "md";
  className?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, activeTab, onTabChange, size = "md", className }, ref) => {
    const sizes = {
      sm: "h-7 px-2.5 text-xs",
      md: "h-8 px-3 text-sm",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 overflow-x-auto border-b border-zinc-800 pb-px",
          className
        )}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0 transition-colors border-b-2 -mb-px",
                sizes[size],
                isActive
                  ? "border-orange-500 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
