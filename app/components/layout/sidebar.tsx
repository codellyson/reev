"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: number;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsed = false,
  onToggle,
}) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 bg-zinc-900 border-r border-zinc-800 transition-base",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-4 h-6 w-6 bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-fast z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-zinc-400" />
          )}
        </button>
      )}

      <nav className="h-full overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {items.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-fast",
                  item.active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && (
                  <span className={cn("flex-shrink-0", collapsed ? "mx-auto" : "")}>
                    {item.icon}
                  </span>
                )}
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-emerald-500 text-zinc-900 text-xs px-2 py-0.5 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
