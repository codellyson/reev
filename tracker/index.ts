import { record } from "rrweb";

interface TrackerConfig {
  projectId: string;
  apiUrl?: string;
}

class ReevTracker {
  private projectId: string;
  private apiUrl: string;
  private sessionId: string;
  private events: any[] = [];
  private stopRecording: (() => void) | null = null;
  private batchInterval: NodeJS.Timeout | null = null;
  private isUnloading = false;

  constructor(config: TrackerConfig) {
    this.projectId = config.projectId;
    this.apiUrl = config.apiUrl || "";
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private generateSessionId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private init(): void {
    try {
      console.log("Reev tracker initializing...", { projectId: this.projectId, apiUrl: this.apiUrl, sessionId: this.sessionId });
      this.startRecording();
      console.log("Reev tracker recording started");
      this.setupBatchSending();
      console.log("Reev tracker batch sending setup complete");
      this.setupUnloadHandler();
      console.log("Reev tracker initialized successfully");
    } catch (error) {
      console.error("Reev tracker initialization failed:", error);
    }
  }

  private startRecording(): void {
    this.stopRecording = record({
      emit: (event) => {
        if (this.isUnloading) return;
        this.events.push(event);
        if (this.events.length === 1) {
          console.log("Reev tracker: First event recorded", event.type);
        }
      },
      maskAllInputs: true,
      maskAllText: false,
      blockClass: "rr-block",
      ignoreClass: "rr-ignore",
    });
  }

  private setupBatchSending(): void {
    this.batchInterval = setInterval(() => {
      this.sendBatch();
    }, 10000);
  }

  private setupUnloadHandler(): void {
    const sendFinalBatch = () => {
      this.isUnloading = true;
      if (this.batchInterval) {
        clearInterval(this.batchInterval);
      }
      this.sendBatch(true);
    };

    window.addEventListener("beforeunload", sendFinalBatch);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        sendFinalBatch();
      }
    });
  }

  private async sendBatch(isFinal = false): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      const url = `${this.apiUrl}/api/events`;
      console.log("Sending batch to:", url, "Events:", eventsToSend.length);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          projectId: this.projectId,
          events: eventsToSend,
        }),
        keepalive: isFinal,
      });

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok && !isFinal) {
        console.warn("Failed to send batch, requeuing events");
        this.events.unshift(...eventsToSend);
      } else {
        console.log("Batch sent successfully");
      }
    } catch (error) {
      console.error("Error sending batch:", error);
      if (!isFinal) {
        this.events.unshift(...eventsToSend);
      }
    }
  }

  public stop(): void {
    if (this.stopRecording) {
      this.stopRecording();
      this.stopRecording = null;
    }
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
  }
}

function initTracker(): void {
  console.log("Reev tracker: initTracker called");
  
  let script = document.currentScript as HTMLScriptElement | null;
  
  if (!script) {
    const scripts = document.querySelectorAll<HTMLScriptElement>('script[data-project-id]');
    if (scripts.length > 0) {
      script = scripts[scripts.length - 1];
      console.log("Reev tracker: Found script element via querySelector");
    }
  }
  
  if (!script) {
    console.error("Reev tracker: Could not find script element");
    return;
  }

  const projectId = script.getAttribute("data-project-id");
  if (!projectId) {
    console.error("Reev: data-project-id attribute is required");
    return;
  }

  const apiUrl = script.getAttribute("data-api-url") || "";
  console.log("Reev tracker: Creating tracker with", { projectId, apiUrl });

  new ReevTracker({ projectId, apiUrl });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTracker);
  } else {
    initTracker();
  }
}

