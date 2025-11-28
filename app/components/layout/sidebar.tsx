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
        "fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-300 transition-base",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-4 h-6 w-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-fast z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
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
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-fast",
                  item.active
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100",
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
                      <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
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

