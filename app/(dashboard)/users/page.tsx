"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/app/components/layout";
import { Badge } from "@/app/components/ui";
import { Users, Activity, Clock, Monitor, Smartphone, Tablet, AlertCircle } from "lucide-react";

interface UserSummary {
  id: string;
  email?: string;
  totalSessions: number;
  lastSeen: Date;
  primaryDevice: "desktop" | "mobile" | "tablet";
  errorCount: number;
}

export default function UsersPage() {
  const router = useRouter();

  const users = useMemo<UserSummary[]>(() => [
    {
      id: "user_1",
      email: "john@example.com",
      totalSessions: 47,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30),
      primaryDevice: "desktop",
      errorCount: 3,
    },
    {
      id: "user_2",
      email: "sarah@example.com",
      totalSessions: 32,
      lastSeen: new Date(Date.now() - 1000 * 60 * 120),
      primaryDevice: "mobile",
      errorCount: 0,
    },
    {
      id: "user_3",
      totalSessions: 18,
      lastSeen: new Date(Date.now() - 1000 * 60 * 240),
      primaryDevice: "desktop",
      errorCount: 1,
    },
    {
      id: "user_4",
      email: "mike@example.com",
      totalSessions: 64,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60),
      primaryDevice: "tablet",
      errorCount: 5,
    },
  ], []);

  const handleUserClick = useCallback((userId: string) => {
    router.push(`/users/${userId}`);
  }, [router]);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getDeviceIcon = (device: UserSummary["primaryDevice"]) => {
    switch (device) {
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Users"
        description={`${users.length} total users`}
        breadcrumbs={[{ label: "Users" }]}
      />

      <div className="bg-zinc-950 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono bg-zinc-900">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono bg-zinc-900">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono bg-zinc-900">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono bg-zinc-900">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono bg-zinc-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
                        <Users className="h-5 w-5 text-zinc-900" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">
                          {user.email || "Anonymous"}
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm font-medium text-zinc-100 font-mono">
                        {user.totalSessions}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400 font-mono">
                        {formatTimeAgo(user.lastSeen)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      {getDeviceIcon(user.primaryDevice)}
                      <span className="text-sm capitalize">
                        {user.primaryDevice}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.errorCount > 0 ? (
                      <Badge variant="error" size="sm" className="flex items-center gap-1 w-fit">
                        <AlertCircle className="h-3 w-3" />
                        {user.errorCount} errors
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        No errors
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
