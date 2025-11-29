"use client";

import React, { useEffect, useRef } from "react";
import rrwebPlayer from "rrweb-player";
import { LoadingSpinner } from "@/app/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import type { SessionEvent } from "@/types/api";

type eventWithTime = {
  type: number;
  data: any;
  timestamp: number;
};

export interface PlayerFrameProps {
  events?: SessionEvent[];
  viewport?: { width: number; height: number };
  loading?: boolean;
  error?: string;
  className?: string;
  isPlaying?: boolean;
  speed?: number;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onSeek?: (time: number) => void;
}

export const PlayerFrame: React.FC<PlayerFrameProps> = ({
  events,
  viewport,
  loading = false,
  error,
  className,
  isPlaying = false,
  speed = 1,
  currentTime = 0,
  onTimeUpdate,
  onDurationChange,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<InstanceType<typeof rrwebPlayer> | null>(null);

  useEffect(() => {
    if (!events || events.length === 0 || !containerRef.current) return;

    // Convert events to rrweb format and normalize timestamps
    const eventsWithNumbers = events.map((e) => ({
      type: e.eventType,
      data: e.data,
      timestamp:
        typeof e.timestamp === "string"
          ? parseInt(e.timestamp, 10)
          : e.timestamp,
    }));

    // Extract viewport dimensions from Meta event (type 4) or use provided viewport
    let recordedViewport = viewport;
    const metaEvent = eventsWithNumbers.find((e) => e.type === 4);
    if (metaEvent?.data?.width && metaEvent?.data?.height) {
      recordedViewport = {
        width: metaEvent.data.width,
        height: metaEvent.data.height,
      };
    }

    // Normalize timestamps to start from 0 (rrweb-player requirement)
    const firstTimestamp = eventsWithNumbers[0]?.timestamp || 0;
    const rrwebEvents: eventWithTime[] = eventsWithNumbers.map((e) => ({
      type: e.type,
      data: e.data,
      timestamp: e.timestamp - firstTimestamp,
    }));

    if (playerRef.current) {
      try {
        const replayer = playerRef.current.getReplayer();
        replayer.destroy();
      } catch (e) {
        console.warn("Error destroying previous player:", e);
      }
      playerRef.current = null;
    }

    // Ensure container has dimensions
    if (!containerRef.current) {
      console.error("Container ref is null");
      return;
    }

    const container = containerRef.current;
    let timeoutId: NodeJS.Timeout | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const initializePlayer = () => {
      if (!containerRef.current) return;

      try {
        containerRef.current.innerHTML = "";

        const recordedWidth = recordedViewport?.width || 1024;
        const recordedHeight = recordedViewport?.height || 768;

        const player = new rrwebPlayer({
          target: containerRef.current,
          props: {
            events: rrwebEvents,
            speed: speed,
            autoPlay: false,
            showController: false,
            width: recordedWidth,
            height: recordedHeight,
          },
        });

        playerRef.current = player;

        const scaleToFit = () => {
          if (!containerRef.current) return;

          const iframe = containerRef.current.querySelector("iframe");
          if (!iframe) return;

          const container = containerRef.current;
          const containerWidth = container.offsetWidth;
          const containerHeight = container.offsetHeight;

          if (containerWidth === 0 || containerHeight === 0) return;

          const scaleX = containerWidth / recordedWidth;
          const scaleY = containerHeight / recordedHeight;
          const scale = Math.min(scaleX, scaleY);

          iframe.style.width = `${recordedWidth}px`;
          iframe.style.height = `${recordedHeight}px`;
          iframe.style.transform = `scale(${scale})`;
          iframe.style.transformOrigin = "top left";

          const scaledWidth = recordedWidth * scale;
          const scaledHeight = recordedHeight * scale;
          const offsetX = (containerWidth - scaledWidth) / 2;
          const offsetY = (containerHeight - scaledHeight) / 2;

          if (offsetX > 0 || offsetY > 0) {
            iframe.style.marginLeft = `${offsetX}px`;
            iframe.style.marginTop = `${offsetY}px`;
          } else {
            iframe.style.marginLeft = "0";
            iframe.style.marginTop = "0";
          }
        };

        setTimeout(() => {
          scaleToFit();

          if (onDurationChange && playerRef.current) {
            try {
              const metaData = playerRef.current.getMetaData();
              const duration = metaData?.totalTime || 0;
              onDurationChange(duration);
            } catch (e) {
              console.warn("Error getting metadata:", e);
            }
          }
        }, 200);

        resizeObserver = new ResizeObserver(() => {
          scaleToFit();
        });

        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }

        const handleStateChange = () => {
          if (onTimeUpdate && playerRef.current) {
            try {
              const replayer = playerRef.current.getReplayer();
              const time = replayer.getCurrentTime();
              onTimeUpdate(time);
            } catch (e) {
              console.warn("Error getting current time:", e);
            }
          }
        };

        player.addEventListener("state-change", handleStateChange);
      } catch (err) {
        console.error("Error creating player:", err);
      }
    };

    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      console.warn("Container has no dimensions, waiting...");
      // Wait a bit for layout
      timeoutId = setTimeout(() => {
        if (container.offsetWidth > 0 && container.offsetHeight > 0) {
          initializePlayer();
        }
      }, 100);
    } else {
      initializePlayer();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (playerRef.current) {
        try {
          const replayer = playerRef.current.getReplayer();
          replayer.destroy();
        } catch (e) {
          console.warn("Error destroying player:", e);
        }
        playerRef.current = null;
      }
    };
  }, [events, onTimeUpdate, onDurationChange, speed]);

  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    } catch (error) {
      console.error("Error controlling playback:", error);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (!playerRef.current) return;
    try {
      const replayer = playerRef.current.getReplayer();
      const current = replayer.getCurrentTime();
      if (Math.abs(current - currentTime) > 100) {
        playerRef.current.goto(currentTime, false);
      }
    } catch (error) {
      console.error("Error seeking:", error);
    }
  }, [currentTime]);

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-xl shadow-inner",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm font-medium text-gray-600">Loading session replay...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 border border-red-200 rounded-xl shadow-inner",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-red-200">
          <p className="text-sm font-semibold text-error mb-2">Error loading session</p>
          <p className="text-xs text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-xl shadow-inner",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-sm font-medium text-gray-600">No session data available</p>
        </div>
      </div>
    );
  }

  const isFullHeight = className?.includes("h-full");

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg",
        className
      )}
      style={{
        width: "100%",
        height: isFullHeight ? "100%" : "600px",
        minHeight: isFullHeight ? "100%" : "600px",
        position: "relative",
      }}
    >
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};
