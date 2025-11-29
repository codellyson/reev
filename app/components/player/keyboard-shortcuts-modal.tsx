"use client";

import { Modal } from "@/app/components/ui";
import { Keyboard } from "lucide-react";
import { PLAYER_SHORTCUTS } from "@/app/hooks/use-player-keyboard-shortcuts";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Keyboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use these shortcuts to control playback
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {PLAYER_SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <span className="text-sm text-gray-900 dark:text-white">
                {shortcut.description}
              </span>
              <div className="flex gap-2">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex} className="flex items-center gap-1">
                    {keyIndex > 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
                    )}
                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm text-gray-900 dark:text-white">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 text-xs font-mono bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">?</kbd> anytime to show this dialog
          </p>
        </div>
      </div>
    </Modal>
  );
}

