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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    onSeek(newTime);
  };

  const speedOptions = [0.5, 1, 2, 4];

  return (
    <div
      className={cn(
        "h-16 bg-gradient-to-t from-gray-950 to-gray-900 border-t border-gray-800 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 rounded-b-xl shadow-lg touch-none",
        className
      )}
      role="toolbar"
      aria-label="Player controls"
    >
      <button
        onClick={onPlayPause}
        className="w-10 h-10 sm:w-9 sm:h-9 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 touch-manipulation shadow-sm"
        aria-label={isPlaying ? "Pause playback" : "Play playback"}
        type="button"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
        ) : (
          <Play className="h-5 w-5 sm:h-4 sm:w-4 ml-0.5" aria-hidden="true" />
        )}
      </button>

      <button
        onClick={() => onSeek(Math.min(currentTime + 10, duration))}
        className="w-10 h-10 sm:w-9 sm:h-9 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 touch-manipulation shadow-sm"
        aria-label="Skip forward 10 seconds"
        type="button"
      >
        <SkipForward className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
      </button>

      <div className="relative">
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="appearance-none bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-2 sm:px-3 py-2 pr-6 sm:pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer transition-all duration-200 touch-manipulation shadow-sm"
          aria-label="Playback speed"
        >
          {speedOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}x
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          step={0.1}
          className="flex-1 h-1 bg-[#333333] rounded-full appearance-none cursor-pointer accent-white focus:outline-none touch-manipulation"
          aria-label="Seek timeline"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
        />
        <div className="text-gray-400 text-xs font-mono min-w-[60px] sm:min-w-[80px] text-right tabular-nums flex-shrink-0">
          <span aria-label={`Current time: ${formatTime(currentTime)}`}>
            {formatTime(currentTime)}
          </span>
          {" / "}
          <span aria-label={`Total duration: ${formatTime(duration)}`}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};
