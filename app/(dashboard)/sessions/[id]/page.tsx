"use client";

import React, { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Clock, MousePointerClick, AlertTriangle, ScrollText, Eye, Globe } from "lucide-react";
import {
  useSession,
  useSessionEvents,
} from "@/app/hooks";
import {
  ErrorBanner,
  Button,
  Badge,
  Skeleton,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import type { PageEvent } from "@/types/api";

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const {
    data: session,
    loading: sessionLoading,
    error: sessionError,
  } = useSession(sessionId);
  const { data: events, loading: eventsLoading } = useSessionEvents(sessionId);

  const eventSummary = useMemo(() => {
    if (!events.length) return null;

    const pageviews = events.filter((e) => e.eventType === "pageview");
    const clicks = events.filter((e) => e.eventType === "click");
    const rageClicks = clicks.filter((e) => e.data?.isRage);
    const errors = events.filter((e) => e.eventType === "error");
    const scrolls = events.filter((e) => e.eventType === "scroll");
    const maxScroll = Math.max(0, ...scrolls.map((e) => e.data?.maxDepth || 0));
    const pagesVisited = [...new Set(pageviews.map((e) => e.data?.url))];

    return {
      pageviews: pageviews.length,
      clicks: clicks.length,
      rageClicks: rageClicks.length,
      errors: errors.length,
      maxScroll,
      pagesVisited,
    };
  }, [events]);

  if (sessionLoading || eventsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-zinc-950" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (sessionError) {
    return <ErrorBanner title="Failed to load session" message={sessionError} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Session Detail"
        description={
          session ? `${session.pageUrl || "Unknown page"} · ${session.device}` : undefined
        }
        breadcrumbs={[
          { label: "Sessions", href: "/sessions" },
          { label: sessionId.slice(0, 8) },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/sessions")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />

      {/* Summary Cards */}
      {eventSummary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-zinc-800">
          <SummaryCard
            icon={<Eye className="h-4 w-4" />}
            label="Pageviews"
            value={eventSummary.pageviews}
          />
          <SummaryCard
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Clicks"
            value={eventSummary.clicks}
            alert={eventSummary.rageClicks > 0 ? `${eventSummary.rageClicks} rage` : undefined}
          />
          <SummaryCard
            icon={<ScrollText className="h-4 w-4" />}
            label="Max Scroll"
            value={`${eventSummary.maxScroll}%`}
          />
          <SummaryCard
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Errors"
            value={eventSummary.errors}
            alert={eventSummary.errors > 0 ? "!" : undefined}
          />
          <SummaryCard
            icon={<Globe className="h-4 w-4" />}
            label="Pages Visited"
            value={eventSummary.pagesVisited.length}
          />
        </div>
      )}

      {/* Pages Visited */}
      {eventSummary && eventSummary.pagesVisited.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 p-5">
          <h3 className="text-sm font-semibold text-white mb-3 font-mono uppercase tracking-wider">Pages Visited</h3>
          <div className="space-y-1">
            {eventSummary.pagesVisited.map((url) => (
              <div key={url} className="text-sm text-zinc-300 px-3 py-2 bg-zinc-900 truncate">
                {formatUrl(url)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Timeline */}
      <div className="bg-zinc-950 border border-zinc-800">
        <div className="p-5 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
            Event Timeline
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            {events.length} event{events.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        <div className="divide-y divide-zinc-800/50">
          {events.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-12">
              No events recorded for this session
            </p>
          ) : (
            events.map((event, index) => (
              <EventRow key={event.id || index} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  alert?: string;
}) {
  return (
    <div className="bg-zinc-950 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-zinc-500">{icon}</span>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider font-mono">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {alert && (
          <Badge variant="error" size="sm">
            {alert}
          </Badge>
        )}
      </div>
    </div>
  );
}

function EventRow({ event }: { event: PageEvent }) {
  const config = EVENT_TYPE_CONFIG[event.eventType] || {
    icon: <Clock className="h-4 w-4" />,
    color: "text-zinc-500",
    bg: "bg-zinc-800",
    label: event.eventType,
  };

  const time = new Date(event.timestamp).toLocaleTimeString();
  const description = getEventDescription(event);

  return (
    <div className="flex items-start gap-3 px-5 py-3 hover:bg-zinc-900/50 transition-colors">
      <div className={`flex-shrink-0 p-1.5 mt-0.5 ${config.bg}`}>
        <span className={config.color}>{config.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-100">
            {config.label}
          </span>
          {event.eventType === "click" && event.data?.isRage && (
            <Badge variant="error" size="sm">rage</Badge>
          )}
          {event.eventType === "error" && (
            <Badge variant="error" size="sm">error</Badge>
          )}
        </div>
        <p className="text-sm text-zinc-400 mt-0.5 truncate">{description}</p>
        {event.url && (
          <p className="text-xs text-zinc-600 mt-0.5 truncate">{formatUrl(event.url)}</p>
        )}
      </div>
      <span className="text-xs text-zinc-600 font-mono flex-shrink-0 mt-1">
        {time}
      </span>
    </div>
  );
}

const EVENT_TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  pageview: {
    icon: <Eye className="h-4 w-4" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    label: "Page View",
  },
  click: {
    icon: <MousePointerClick className="h-4 w-4" />,
    color: "text-zinc-400",
    bg: "bg-zinc-800",
    label: "Click",
  },
  scroll: {
    icon: <ScrollText className="h-4 w-4" />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Scroll",
  },
  form: {
    icon: <ScrollText className="h-4 w-4" />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    label: "Form",
  },
  error: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-red-400",
    bg: "bg-red-500/10",
    label: "Error",
  },
  vitals: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "Web Vital",
  },
  page_leave: {
    icon: <ArrowLeft className="h-4 w-4" />,
    color: "text-zinc-500",
    bg: "bg-zinc-800",
    label: "Page Leave",
  },
};

function getEventDescription(event: PageEvent): string {
  const d = event.data || {};
  switch (event.eventType) {
    case "pageview":
      return d.title || d.url || "Page loaded";
    case "click":
      return d.text
        ? `Clicked "${d.text}" (${d.selector})`
        : `Clicked ${d.selector || "element"}`;
    case "scroll":
      return `Scrolled to ${d.maxDepth || 0}%`;
    case "form":
      if (d.action === "submit") return `Submitted form "${d.formId}"`;
      if (d.action === "abandon") return `Abandoned form "${d.formId}" (${d.fieldCount} fields)`;
      return `Focused on ${d.fieldName} in "${d.formId}"`;
    case "error":
      return d.message || "Unknown error";
    case "vitals":
      return `${(d.metric || "").toUpperCase()}: ${d.value}${d.metric === "cls" ? "" : "ms"}`;
    case "page_leave":
      return `Left page after ${Math.round((d.timeOnPage || 0) / 1000)}s`;
    default:
      return JSON.stringify(d).slice(0, 100);
  }
}

function formatUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}
