"use client";

import React from "react";
import { Play, Pause, SkipForward, ChevronDown } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  currentTime,
  duration,
  onSeek,
  className,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    onSeek(newTime);
  };

  const speedOptions = [0.5, 1, 2, 4];

  return (
    <div
      className={cn(
        "h-14 bg-black flex items-center gap-4 px-6 rounded-b-lg",
        className
      )}
    >
      <button
        onClick={onPlayPause}
        className="w-8 h-8 bg-transparent border-none text-white flex items-center justify-center rounded-sm cursor-pointer transition-base hover:bg-[#333333]"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>

      <button
        onClick={() => onSeek(Math.min(currentTime + 10, duration))}
        className="w-8 h-8 bg-transparent border-none text-white flex items-center justify-center rounded-sm cursor-pointer transition-base hover:bg-[#333333]"
        aria-label="Skip forward 10 seconds"
      >
        <SkipForward className="h-4 w-4" />
      </button>

      <div className="relative">
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="appearance-none bg-[#333333] text-white text-sm px-3 py-1.5 pr-8 rounded-sm focus:outline-none cursor-pointer transition-base hover:bg-[#404040]"
          aria-label="Playback speed"
        >
          {speedOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}x
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      <div className="flex-1 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 bg-[#333333] rounded-full appearance-none cursor-pointer accent-white"
          aria-label="Seek timeline"
        />
        <div className="text-gray-400 text-xs font-mono min-w-[80px] text-right tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

