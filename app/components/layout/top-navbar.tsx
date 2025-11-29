"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface TopNavbarProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  user?: { name: string; avatar?: string };
  onLogout?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  logo,
  navItems,
  user,
  onLogout,
}) => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          {logo && (
            <Link
              href="/"
              className="flex items-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm transition-opacity hover:opacity-80"
              aria-label="Home"
            >
              {logo}
            </Link>
          )}
          {navItems && navItems.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 sm:px-4 py-2 text-sm rounded-lg transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
                      isActive
                        ? "text-black font-semibold bg-gray-100"
                        : "text-gray-600 hover:text-black hover:bg-gray-50 font-medium"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name} avatar`}
                  className="h-7 w-7 rounded-full ring-2 ring-gray-200"
                  aria-hidden="false"
                />
              ) : (
                <div
                  className="h-7 w-7 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center ring-2 ring-gray-200 shadow-sm"
                  aria-hidden="true"
                >
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <span
                className="text-sm font-medium text-gray-700 hidden sm:inline"
                aria-label={`Logged in as ${user.name}`}
              >
                {user.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
