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

  // Mock users data - replace with real API data
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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-150 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center ring-2 ring-gray-200 shadow-sm">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">
                          {user.email || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-600 font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-semibold text-black">
                        {user.totalSessions}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {formatTimeAgo(user.lastSeen)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(user.primaryDevice)}
                      <span className="text-sm text-gray-700 capitalize">
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
                      <Badge variant="success" size="sm" className="bg-green-100 text-green-700">
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
