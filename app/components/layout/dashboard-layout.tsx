"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List } from "lucide-react";
import { TopNavbar, type NavItem } from "@/app/components/layout";
import { Logo } from "@/app/components/logo";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Sessions",
      href: "/sessions",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopNavbar
        logo={<Logo />}
        navItems={navItems}
        user={{ name: "Analyst" }}
        onLogout={() => console.log("Logout")}
      />
      <main className="pt-14">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

