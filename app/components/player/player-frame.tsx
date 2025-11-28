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
      timestamp: typeof e.timestamp === 'string' ? parseInt(e.timestamp, 10) : e.timestamp,
    }));

    // Extract viewport dimensions from Meta event (type 4) or use provided viewport
    let recordedViewport = viewport;
    const metaEvent = eventsWithNumbers.find(e => e.type === 4);
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

    console.log("Initializing rrweb-player with events:", {
      count: rrwebEvents.length,
      firstEvent: rrwebEvents[0],
      lastEvent: rrwebEvents[rrwebEvents.length - 1],
    });

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

    const initializePlayer = () => {
      if (!containerRef.current) return;

      try {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        // Get container dimensions for player sizing
        const containerWidth = containerRef.current.offsetWidth || viewport?.width || 1024;
        const containerHeight = containerRef.current.offsetHeight || viewport?.height || 768;
        
        const player = new rrwebPlayer({
          target: containerRef.current,
          props: {
            events: rrwebEvents,
            speed: speed,
            autoPlay: false,
            showController: false,
            width: containerWidth,
            height: containerHeight,
          },
        });

        playerRef.current = player;
        console.log("Player initialized successfully", player);
        
        // Ensure the player scales to fill the container
        setTimeout(() => {
          const playerElement = containerRef.current?.querySelector('.rr-player');
          const iframe = containerRef.current?.querySelector('iframe');
          const wrapper = containerRef.current?.querySelector('.rr-player__frame');
          
          if (playerElement) {
            (playerElement as HTMLElement).style.width = '100%';
            (playerElement as HTMLElement).style.height = '100%';
          }
          
          if (wrapper) {
            (wrapper as HTMLElement).style.width = '100%';
            (wrapper as HTMLElement).style.height = '100%';
          }
          
          if (iframe && containerRef.current) {
            const container = containerRef.current;
            const containerW = container.offsetWidth;
            const containerH = container.offsetHeight;
            
            // Use recorded viewport or fallback
            const recordedWidth = recordedViewport?.width || 1024;
            const recordedHeight = recordedViewport?.height || 768;
            
            // Calculate scale to fit container while maintaining aspect ratio
            const scaleX = containerW / recordedWidth;
            const scaleY = containerH / recordedHeight;
            const scale = Math.min(scaleX, scaleY);
            
            // Set iframe to recorded size and scale it
            iframe.style.width = `${recordedWidth}px`;
            iframe.style.height = `${recordedHeight}px`;
            iframe.style.border = 'none';
            iframe.style.transform = `scale(${scale})`;
            iframe.style.transformOrigin = 'top left';
            
            // Adjust container to center the scaled iframe
            const scaledWidth = recordedWidth * scale;
            const scaledHeight = recordedHeight * scale;
            const offsetX = (containerW - scaledWidth) / 2;
            const offsetY = (containerH - scaledHeight) / 2;
            
            if (offsetX > 0 || offsetY > 0) {
              iframe.style.marginLeft = `${offsetX}px`;
              iframe.style.marginTop = `${offsetY}px`;
            }
            
            console.log("Player scaled:", {
              container: { w: containerW, h: containerH },
              recorded: { w: recordedWidth, h: recordedHeight },
              scale,
              scaled: { w: scaledWidth, h: scaledHeight }
            });
          }
        }, 400);

        // Get metadata after a short delay to ensure player is ready
        setTimeout(() => {
          if (onDurationChange && playerRef.current) {
            try {
              const metaData = playerRef.current.getMetaData();
              const duration = metaData?.totalTime || 0;
              console.log("Player metadata:", metaData);
              onDurationChange(duration);
            } catch (e) {
              console.warn("Error getting metadata:", e);
            }
          }
        }, 100);

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
          "flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-500">Loading session replay...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <p className="text-sm text-error mb-2">Error loading session</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-500">No session data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-gray-100 border border-gray-300 rounded-lg overflow-hidden",
        className
      )}
      style={{
        width: "100%",
        maxWidth: "100%",
        minHeight: "600px",
        height: "600px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </div>
  );
};

