"use client";

import { useEffect, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  target?: HTMLElement | null;
}

export const useKeyboardShortcuts = ({
  shortcuts,
  enabled = true,
  target,
}: UseKeyboardShortcutsOptions) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = e.key === shortcut.key || e.code === shortcut.key;
        const ctrlMatches = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
        const shiftMatches = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatches = shortcut.alt ? e.altKey : !e.altKey;
        const metaMatches = shortcut.meta ? e.metaKey : !e.metaKey;

        if (
          keyMatches &&
          ctrlMatches &&
          shiftMatches &&
          altMatches &&
          metaMatches
        ) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    const element = target || window;
    element.addEventListener("keydown", handleKeyDown as EventListener);
    return () => element.removeEventListener("keydown", handleKeyDown as EventListener);
  }, [handleKeyDown, target]);
};
