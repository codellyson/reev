"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { User, LogOut, Menu, X } from "lucide-react";
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
  projectSwitcher?: React.ReactNode;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  logo,
  navItems,
  user,
  onLogout,
  projectSwitcher,
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-14 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-50"
      role="navigation"
      aria-label="Main navigation"
      ref={menuRef}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          {logo && (
            <Link
              href="/"
              className="flex items-center flex-shrink-0 transition-opacity hover:opacity-80"
              aria-label="Home"
            >
              {logo}
            </Link>
          )}

          {/* Desktop nav items */}
          {navItems && navItems.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 sm:px-4 py-2 text-sm transition-colors whitespace-nowrap",
                      isActive
                        ? "text-white font-semibold bg-zinc-900"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900 font-medium"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop project switcher */}
          {projectSwitcher && (
            <div className="hidden md:flex items-center">
              {projectSwitcher}
            </div>
          )}
        </div>

        {/* Right: user + mobile hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {user && (
            <>
              <div className="flex items-center gap-2 px-2 py-1.5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    className="h-7 w-7 ring-2 ring-zinc-700"
                    aria-hidden="false"
                  />
                ) : (
                  <div
                    className="h-7 w-7 bg-orange-500 flex items-center justify-center ring-2 ring-zinc-700"
                    aria-hidden="true"
                  >
                    <User className="h-3.5 w-3.5 text-zinc-900" />
                  </div>
                )}
                <span
                  className="text-sm font-medium text-zinc-300 hidden sm:inline"
                  aria-label={`Logged in as ${user.name}`}
                >
                  {user.name}
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="hidden md:flex items-center gap-1.5 px-2 py-1.5 hover:bg-zinc-900 transition-colors text-sm font-medium text-zinc-400 hover:text-white"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {navItems?.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "text-white font-semibold bg-zinc-900"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900 font-medium"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            {projectSwitcher && (
              <div className="pt-2 border-t border-zinc-800 mt-2">
                {projectSwitcher}
              </div>
            )}

            {onLogout && (
              <div className="pt-2 border-t border-zinc-800 mt-2">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
