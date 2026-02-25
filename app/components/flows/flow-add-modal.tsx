"use client";

import React, { useState } from "react";
import { Modal, Button, FormField, Input } from "@/app/components/ui";

interface FlowAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    sourceUrlPattern: string;
    targetUrl: string;
    targetLabel: string;
    priority: number;
  }) => void;
  submitting?: boolean;
}

export const FlowAddModal: React.FC<FlowAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [sourceUrl, setSourceUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [targetLabel, setTargetLabel] = useState("");
  const [priority, setPriority] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl.trim() || !targetUrl.trim() || !targetLabel.trim()) return;
    onSubmit({
      sourceUrlPattern: sourceUrl.trim(),
      targetUrl: targetUrl.trim(),
      targetLabel: targetLabel.trim(),
      priority,
    });
    setSourceUrl("");
    setTargetUrl("");
    setTargetLabel("");
    setPriority(10);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Navigation Suggestion"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              submitting ||
              !sourceUrl.trim() ||
              !targetUrl.trim() ||
              !targetLabel.trim()
            }
          >
            {submitting ? "Adding..." : "Add Suggestion"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Source Page" hint="The page pathname where this suggestion appears (e.g. /orders)">
          <Input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="/orders"
          />
        </FormField>

        <FormField label="Target URL" hint="Where the suggestion links to (e.g. /orders/new)">
          <Input
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="/orders/new"
          />
        </FormField>

        <FormField label="Label" hint="What users see on the suggestion button">
          <Input
            value={targetLabel}
            onChange={(e) => setTargetLabel(e.target.value)}
            placeholder="Create New Order"
          />
        </FormField>

        <FormField label="Priority" hint="Higher numbers appear first (default: 10)">
          <Input
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
            min={0}
            max={100}
          />
        </FormField>
      </form>
    </Modal>
  );
};
