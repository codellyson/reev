"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { TopNavbar, type NavItem } from "@/app/components/layout";
import { ProjectSwitcher } from "@/app/components/layout/project-switcher";
import { Logo } from "@/app/components/logo";
import { LoadingSpinner } from "@/app/components/ui";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  const isFullWidth = pathname?.startsWith("/session/");

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNavbar
        logo={<Logo />}
        navItems={navItems}
        user={{ name: session?.user?.name || session?.user?.email || "User" }}
        onLogout={handleLogout}
        projectSwitcher={<ProjectSwitcher />}
      />
      <main className="pt-14" role="main">
        <div
          className={
            isFullWidth
              ? "w-full"
              : "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
          }
        >
          {children}
        </div>
      </main>
    </div>
  );
};
