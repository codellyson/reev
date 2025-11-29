"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Maximize2, Minimize2, Keyboard } from "lucide-react";
import {
  PlayerFrame,
  PlayerControls,
  EventTimeline,
  KeyboardShortcutsModal,
} from "@/app/components/player";
import { TagSelector } from "@/app/components/sessions";
import {
  useSession,
  useSessionEvents,
  useTags,
  useSessionTags,
  useAddSessionTag,
  useRemoveSessionTag,
} from "@/app/hooks";
import {
  LoadingSpinner,
  ErrorBanner,
  Button,
  SkeletonPlayerFrame,
  useToast,
} from "@/app/components/ui";
import { PageHeader } from "@/app/components/layout";
import type { TimelineEvent } from "@/app/components/player/event-timeline";

export default function SessionPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: session,
    loading: sessionLoading,
    error: sessionError,
  } = useSession(sessionId);
  const { data: events, loading: eventsLoading } = useSessionEvents(sessionId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const { success, error: showError } = useToast();
  const { data: allTags = [] } = useTags();
  const { data: sessionTags = [] } = useSessionTags(sessionId);
  const addTag = useAddSessionTag(sessionId);
  const removeTag = useRemoveSessionTag(sessionId);

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

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    return (
      events?.map((event) => {
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
      }) || []
    );
  }, [events]);

  const handleEventClick = useCallback(
    (event: TimelineEvent) => {
      handleSeek(event.timestamp * 1000);
    },
    [handleSeek]
  );

  const viewport = useMemo(() => ({ width: 1024, height: 768 }), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeek(Math.max(0, currentTime - 5));
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeek(Math.min(duration, currentTime + 5));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSpeed((prev) => Math.min(4, prev + 0.5));
          break;
        case "ArrowDown":
          e.preventDefault();
          setSpeed((prev) => Math.max(0.5, prev - 0.5));
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            e.preventDefault();
            setIsFullscreen(false);
          } else if (showKeyboardHelp) {
            e.preventDefault();
            setShowKeyboardHelp(false);
          }
          break;
        case "?":
          if (e.shiftKey) {
            e.preventDefault();
            setShowKeyboardHelp(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isPlaying,
    currentTime,
    duration,
    isFullscreen,
    handlePlayPause,
    handleSeek,
    toggleFullscreen,
    showKeyboardHelp,
  ]);

  const handleAddTag = useCallback(
    async (tagId: string) => {
      try {
        await addTag.mutateAsync(tagId);
        success("Tag added successfully");
      } catch (err) {
        showError("Failed to add tag");
      }
    },
    [addTag, success, showError]
  );

  const handleRemoveTag = useCallback(
    async (tagId: string) => {
      try {
        await removeTag.mutateAsync(tagId);
        success("Tag removed successfully");
      } catch (err) {
        showError("Failed to remove tag");
      }
    },
    [removeTag, success, showError]
  );

  if (sessionLoading || eventsLoading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="h-16" />
        </div>
        <div className="flex-1 p-4">
          <SkeletonPlayerFrame />
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <ErrorBanner title="Failed to load session" message={sessionError} />
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="h-screen flex flex-col bg-gray-50"
        tabIndex={0}
        role="application"
        aria-label="Session replay player"
      >
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <PageHeader
          title="Session Replay"
          description={
            session ? `${session.pageUrl} • ${session.device}` : undefined
          }
          breadcrumbs={[
            { label: "Sessions", href: "/sessions" },
            { label: session?.id || "Session" },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyboardHelp(true)}
                aria-label="Show keyboard shortcuts"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/sessions")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          }
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 p-2 sm:p-4 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 min-h-0">
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
              className="h-full"
            />
          </div>
          <div className="flex-shrink-0 mt-2 sm:mt-4">
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
        </div>
        {!isFullscreen && (
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
              <TagSelector
                availableTags={allTags}
                selectedTags={sessionTags}
                onTagAdd={handleAddTag}
                onTagRemove={handleRemoveTag}
              />
            </div>
            <EventTimeline
              events={timelineEvents}
              currentTime={currentTime}
              onEventClick={handleEventClick}
              className="h-full"
            />
          </div>
        )}
      </div>
      <div className="hidden sm:block text-xs text-gray-500 px-4 py-2 bg-white border-t border-gray-200">
        <span className="font-medium">Keyboard shortcuts:</span>{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Space</kbd> Play/Pause
        •{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">←</kbd>/
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">→</kbd> Seek •{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↑</kbd>/
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↓</kbd> Speed •{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">F</kbd> Fullscreen •{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">?</kbd> Help
      </div>
      </div>

      <KeyboardShortcutsModal
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </>
  );
}
