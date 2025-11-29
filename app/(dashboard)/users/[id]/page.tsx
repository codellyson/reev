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

  // Mock user data - replace with real API data
  const user = useMemo<UserProfile>(() => ({
    id: userId,
    email: "user@example.com",
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    totalSessions: 47,
    totalDuration: 12450, // seconds
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

  // Mock sessions data
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center ring-2 ring-gray-200 shadow-sm flex-shrink-0">
            <User className="h-8 w-8 text-white" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-black mb-1">
                {user.email || "Anonymous User"}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm" className="bg-gray-100 text-gray-700 font-mono">
                  ID: {user.id}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">First Seen</p>
                  <p className="text-sm font-semibold text-black">
                    {user.firstSeen.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Last Seen</p>
                  <p className="text-sm font-semibold text-black">
                    {user.lastSeen.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {user.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="text-sm font-semibold text-black">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-bold text-black mb-4">Device Usage</h3>
          <div className="space-y-3">
            {Object.entries(user.devices).map(([device, count]) => {
              const Icon = device === "desktop" ? Monitor : device === "mobile" ? Smartphone : Tablet;
              const percentage = Math.round((count / user.totalSessions) * 100);
              return (
                <div key={device}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-black capitalize">{device}</span>
                    </div>
                    <span className="text-sm font-semibold text-black">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-bold text-black mb-4">Browser Usage</h3>
          <div className="space-y-3">
            {Object.entries(user.browsers).map(([browser, count]) => {
              const percentage = Math.round((count / user.totalSessions) * 100);
              return (
                <div key={browser}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-black">{browser}</span>
                    </div>
                    <span className="text-sm font-semibold text-black">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-600 rounded-full transition-all duration-500"
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
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-black">All Sessions ({sessions.length})</h3>
          {user.errorCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">
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
