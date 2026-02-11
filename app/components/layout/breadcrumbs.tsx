"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4 text-zinc-600" />,
  className,
}) => {
  return (
    <nav
      className={cn("flex items-center gap-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast ? (
                <span
                  className="font-semibold text-zinc-100"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-zinc-500 hover:text-zinc-300 transition-fast"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-500">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
