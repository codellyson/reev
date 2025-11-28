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
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          {logo && (
            <Link href="/" className="flex items-center">
              {logo}
            </Link>
          )}
          {navItems && navItems.length > 0 && (
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 text-sm transition-base",
                      isActive
                        ? "text-black font-medium"
                        : "text-gray-600 hover:text-black"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-black flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <span className="text-sm text-gray-600">{user.name}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

