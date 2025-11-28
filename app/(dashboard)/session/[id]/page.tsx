"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { PlayerFrame, PlayerControls, EventTimeline } from "@/app/components/player";
import { useSession, useSessionEvents } from "@/app/hooks";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";
import type { TimelineEvent } from "@/app/components/player/event-timeline";

export default function SessionPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const { data: session, loading: sessionLoading, error: sessionError } = useSession(sessionId);
  const { data: events, loading: eventsLoading } = useSessionEvents(sessionId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    setIsPlaying(false);
  }, []);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    return events?.map((event) => {
      let type: TimelineEvent["type"] = "click";
      let description = "Event";
      let severity: TimelineEvent["severity"] = "info";

      if (event.eventType === 6) {
        type = "click";
        description = `Click at (${event.data.x}, ${event.data.y})`;
      } else if (event.eventType === 3) {
        type = "navigation";
        description = "Page navigation";
      } else if (event.eventType === 7) {
        type = "scroll";
        description = `Scrolled to ${event.data.y}px`;
      } else if (event.eventType === 8) {
        type = "error";
        description = event.data.message || "Error occurred";
        severity = "error";
      }

      return {
        type,
        timestamp: event.timestamp,
        description,
        severity,
      };
    }) || [];
  }, [events]);

  const handleEventClick = useCallback((event: TimelineEvent) => {
    handleSeek(event.timestamp * 1000);
  }, [handleSeek]);

  // Use responsive viewport based on container size
  const viewport = useMemo(() => ({ width: 1024, height: 768 }), []);

  if (sessionLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (sessionError) {
    return <ErrorBanner title="Failed to load session" message={sessionError} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-black">Session Replay</h1>
        {session && (
          <p className="text-sm text-gray-600 mt-1">
            {session.pageUrl} • {session.device}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="w-full" style={{ maxWidth: "100%" }}>
            <PlayerFrame
              events={events}
              viewport={viewport}
              loading={eventsLoading}
              isPlaying={isPlaying}
              speed={speed}
              currentTime={currentTime}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onSeek={handleSeek}
            />
          </div>
        </div>
        <div className="lg:w-80 flex-shrink-0">
          <EventTimeline
            events={timelineEvents}
            currentTime={currentTime}
            onEventClick={handleEventClick}
          />
        </div>
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        speed={speed}
        onSpeedChange={setSpeed}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />
    </div>
  );
}

