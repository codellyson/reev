"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/layout";
import { SessionList } from "@/app/components/sessions";
import { StatsCard } from "@/app/components/analytics";
import { Badge } from "@/app/components/ui";
import {
  User,
  Activity,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Globe,
  Calendar,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  firstSeen: Date;
  lastSeen: Date;
  totalSessions: number;
  totalDuration: number;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browsers: Record<string, number>;
  location?: {
    country: string;
    city?: string;
  };
  errorCount: number;
}

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const user = useMemo<UserProfile>(() => ({
    id: userId,
    email: "user@example.com",
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    totalSessions: 47,
    totalDuration: 12450,
    devices: {
      desktop: 32,
      mobile: 12,
      tablet: 3,
    },
    browsers: {
      Chrome: 35,
      Safari: 8,
      Firefox: 4,
    },
    location: {
      country: "United States",
      city: "San Francisco",
    },
    errorCount: 3,
  }), [userId]);

  const sessions = useMemo(() => [
    {
      id: "sess_1",
      duration: 245,
      pageUrl: "/products",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      device: "desktop" as const,
      userAgent: "Chrome",
      clicks: 12,
      errors: 0,
    },
    {
      id: "sess_2",
      duration: 189,
      pageUrl: "/checkout",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      device: "mobile" as const,
      userAgent: "Safari",
      clicks: 8,
      errors: 1,
    },
    {
      id: "sess_3",
      duration: 421,
      pageUrl: "/dashboard",
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      device: "desktop" as const,
      userAgent: "Chrome",
      clicks: 24,
      errors: 0,
    },
  ], []);

  const handleSessionClick = useCallback((session: any) => {
    router.push(`/session/${session.id}`);
  }, [router]);

  const primaryDevice = useMemo(() => {
    const entries = Object.entries(user.devices) as [keyof typeof user.devices, number][];
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [user]);

  const primaryBrowser = useMemo(() => {
    const entries = Object.entries(user.browsers);
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User Profile"
        description={user.email || user.id}
        breadcrumbs={[
          { label: "Users", href: "/users" },
          { label: user.id.slice(0, 8) + "..." },
        ]}
      />

      {/* User Info Card */}
      <div className="bg-zinc-950 border border-zinc-800 p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-zinc-900" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user.email || "Anonymous User"}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm" className="font-mono">
                  ID: {user.id}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">First Seen</p>
                  <p className="text-sm font-medium text-zinc-100">
                    {user.firstSeen.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Last Seen</p>
                  <p className="text-sm font-medium text-zinc-100">
                    {user.lastSeen.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {user.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Location</p>
                    <p className="text-sm font-medium text-zinc-100">
                      {user.location.city ? `${user.location.city}, ` : ""}{user.location.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
        <StatsCard
          icon={<Activity className="h-5 w-5" />}
          label="Total Sessions"
          value={user.totalSessions.toString()}
        />
        <StatsCard
          icon={<Clock className="h-5 w-5" />}
          label="Total Time"
          value={`${Math.floor(user.totalDuration / 60)}m`}
        />
        <StatsCard
          icon={
            primaryDevice === "desktop" ? (
              <Monitor className="h-5 w-5" />
            ) : primaryDevice === "mobile" ? (
              <Smartphone className="h-5 w-5" />
            ) : (
              <Tablet className="h-5 w-5" />
            )
          }
          label="Primary Device"
          value={primaryDevice.charAt(0).toUpperCase() + primaryDevice.slice(1)}
        />
        <StatsCard
          icon={<Globe className="h-5 w-5" />}
          label="Primary Browser"
          value={primaryBrowser}
        />
      </div>

      {/* Device & Browser Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800">
        {/* Device Breakdown */}
        <div className="bg-zinc-950 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 font-mono uppercase tracking-wider">Device Usage</h3>
          <div className="space-y-3">
            {Object.entries(user.devices).map(([device, count]) => {
              const Icon = device === "desktop" ? Monitor : device === "mobile" ? Smartphone : Tablet;
              const percentage = Math.round((count / user.totalSessions) * 100);
              return (
                <div key={device}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-100 capitalize">{device}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-100 font-mono">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-zinc-950 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 font-mono uppercase tracking-wider">Browser Usage</h3>
          <div className="space-y-3">
            {Object.entries(user.browsers).map(([browser, count]) => {
              const percentage = Math.round((count / user.totalSessions) * 100);
              return (
                <div key={browser}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-100">{browser}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-100 font-mono">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-zinc-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-zinc-950 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">All Sessions ({sessions.length})</h3>
          {user.errorCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">
                {user.errorCount} sessions with errors
              </span>
            </div>
          )}
        </div>
        <SessionList
          sessions={sessions}
          onSessionClick={handleSessionClick}
          loading={false}
        />
      </div>
    </div>
  );
}
