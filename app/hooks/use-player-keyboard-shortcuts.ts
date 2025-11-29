"use client";

import { useKeyboardShortcuts, KeyboardShortcut } from "./use-keyboard-shortcuts";

export interface UsePlayerKeyboardShortcutsOptions {
  onPlayPause?: () => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onSpeedUp?: () => void;
  onSpeedDown?: () => void;
  onToggleFullscreen?: () => void;
  onToggleMute?: () => void;
  onJumpToStart?: () => void;
  onJumpToEnd?: () => void;
  enabled?: boolean;
}

export const usePlayerKeyboardShortcuts = ({
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onSpeedUp,
  onSpeedDown,
  onToggleFullscreen,
  onToggleMute,
  onJumpToStart,
  onJumpToEnd,
  enabled = true,
}: UsePlayerKeyboardShortcutsOptions) => {
  const shortcuts: KeyboardShortcut[] = [];

  if (onPlayPause) {
    shortcuts.push({
      key: " ",
      handler: onPlayPause,
      preventDefault: true,
    });
    shortcuts.push({
      key: "k",
      handler: onPlayPause,
      preventDefault: true,
    });
  }

  if (onSkipForward) {
    shortcuts.push({
      key: "ArrowRight",
      handler: onSkipForward,
      preventDefault: true,
    });
    shortcuts.push({
      key: "l",
      handler: onSkipForward,
      preventDefault: true,
    });
  }

  if (onSkipBackward) {
    shortcuts.push({
      key: "ArrowLeft",
      handler: onSkipBackward,
      preventDefault: true,
    });
    shortcuts.push({
      key: "j",
      handler: onSkipBackward,
      preventDefault: true,
    });
  }

  if (onSpeedUp) {
    shortcuts.push({
      key: ">",
      shift: true,
      handler: onSpeedUp,
      preventDefault: true,
    });
  }

  if (onSpeedDown) {
    shortcuts.push({
      key: "<",
      shift: true,
      handler: onSpeedDown,
      preventDefault: true,
    });
  }

  if (onToggleFullscreen) {
    shortcuts.push({
      key: "f",
      handler: onToggleFullscreen,
      preventDefault: true,
    });
  }

  if (onToggleMute) {
    shortcuts.push({
      key: "m",
      handler: onToggleMute,
      preventDefault: true,
    });
  }

  if (onJumpToStart) {
    shortcuts.push({
      key: "Home",
      handler: onJumpToStart,
      preventDefault: true,
    });
    shortcuts.push({
      key: "0",
      handler: onJumpToStart,
      preventDefault: true,
    });
  }

  if (onJumpToEnd) {
    shortcuts.push({
      key: "End",
      handler: onJumpToEnd,
      preventDefault: true,
    });
  }

  useKeyboardShortcuts({
    shortcuts,
    enabled,
  });
};

export const PLAYER_SHORTCUTS = [
  { keys: ["Space", "K"], description: "Play/Pause" },
  { keys: ["←", "J"], description: "Skip backward 5s" },
  { keys: ["→", "L"], description: "Skip forward 5s" },
  { keys: ["Shift + <"], description: "Decrease playback speed" },
  { keys: ["Shift + >"], description: "Increase playback speed" },
  { keys: ["F"], description: "Toggle fullscreen" },
  { keys: ["M"], description: "Toggle mute" },
  { keys: ["Home", "0"], description: "Jump to start" },
  { keys: ["End"], description: "Jump to end" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
] as const;

