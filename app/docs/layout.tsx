"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/components/logo";
import {
  BookOpen,
  Rocket,
  Settings,
  Code,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const NAV = [
  { href: "/docs", label: "Overview", icon: BookOpen, exact: true },
  { href: "/docs/getting-started", label: "Getting Started", icon: Rocket },
  { href: "/docs/configuration", label: "Configuration", icon: Settings },
  { href: "/docs/api-reference", label: "API Reference", icon: Code },
  { href: "/docs/troubleshooting", label: "Troubleshooting", icon: AlertCircle },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to home
        </Link>
        <Link href="/" className="block mb-8">
          <Logo className="text-white" width={90} height={24} />
        </Link>
        <nav className="space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  active
                    ? "text-orange-400 bg-orange-500/10 font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden border-b border-zinc-800 mb-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
      <div className="flex items-center justify-between py-3 mb-3">
        <Link href="/">
          <Logo className="text-white" width={80} height={20} />
        </Link>
        <Link
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 inline mr-1" />
          Home
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-3">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
                active
                  ? "text-orange-400 bg-orange-500/10 font-medium"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex gap-12">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <MobileNav />
          <div className="prose-reev">{children}</div>
        </main>
      </div>
    </div>
  );
}
