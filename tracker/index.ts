interface TrackerConfig {
  projectId: string;
  apiUrl?: string;
}

interface TrackerEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
}

interface ClickTrack {
  selector: string;
  count: number;
  firstClick: number;
}

class ReevTracker {
  private projectId: string;
  private apiUrl: string;
  private sessionId: string;
  private events: TrackerEvent[] = [];
  private batchInterval: ReturnType<typeof setInterval> | null = null;
  private maxScrollDepth = 0;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastClickTrack: ClickTrack | null = null;
  private formStates: Map<string, { fields: Set<string>; startedAt: number }> =
    new Map();
  private pageEnteredAt: number = Date.now();
  private currentUrl: string = "";
  private observers: (() => void)[] = [];

  constructor(config: TrackerConfig) {
    this.projectId = config.projectId;
    this.apiUrl = config.apiUrl || "";
    this.sessionId = this.generateSessionId();
    this.currentUrl = location.href;
    this.init();
  }

  private generateSessionId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private now(): number {
    return Date.now();
  }

  private push(type: string, data: Record<string, any>): void {
    this.events.push({ type, data, timestamp: this.now() });
  }

  private init(): void {
    try {
      this.trackPageview();
      this.trackClicks();
      this.trackScroll();
      this.trackForms();
      this.trackErrors();
      this.trackVitals();
      this.trackNavigation();
      this.setupBatchSending();
      this.setupUnloadHandler();
    } catch (_) {
      // silent fail — tracker should never break the host page
    }
  }

  // --- Page Views ---

  private trackPageview(): void {
    this.pageEnteredAt = this.now();
    this.maxScrollDepth = 0;
    this.push("pageview", {
      url: location.href,
      referrer: document.referrer,
      title: document.title,
      viewport: { w: window.innerWidth, h: window.innerHeight },
    });
  }

  // --- Clicks & Rage Clicks ---

  private trackClicks(): void {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target) return;

      const selector = this.getSelector(target);
      const text = (target.textContent || "").trim().slice(0, 100);
      const now = this.now();

      // Rage click detection: 3+ clicks on same element within 1s
      let isRage = false;
      if (
        this.lastClickTrack &&
        this.lastClickTrack.selector === selector &&
        now - this.lastClickTrack.firstClick < 1000
      ) {
        this.lastClickTrack.count++;
        if (this.lastClickTrack.count >= 3) {
          isRage = true;
        }
      } else {
        this.lastClickTrack = { selector, count: 1, firstClick: now };
      }

      this.push("click", {
        selector,
        text,
        x: e.clientX,
        y: e.clientY,
        isRage,
        url: location.href,
      });
    };

    document.addEventListener("click", handler, true);
    this.observers.push(() =>
      document.removeEventListener("click", handler, true)
    );
  }

  // --- Scroll Depth ---

  private trackScroll(): void {
    const handler = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const viewportHeight = window.innerHeight;
      const maxScroll = docHeight - viewportHeight;

      if (maxScroll <= 0) return;

      const depth = Math.min(
        100,
        Math.round((scrollTop / maxScroll) * 100)
      );

      if (depth > this.maxScrollDepth) {
        this.maxScrollDepth = depth;
      }

      // Throttle: only emit after 500ms of no scrolling
      if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.push("scroll", {
          maxDepth: this.maxScrollDepth,
          url: location.href,
        });
      }, 500);
    };

    window.addEventListener("scroll", handler, { passive: true });
    this.observers.push(() => window.removeEventListener("scroll", handler));
  }

  // --- Form Interactions ---

  private trackForms(): void {
    const focusHandler = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!this.isFormField(target)) return;

      const form = (target as HTMLInputElement).form;
      const formId = form
        ? form.id || form.getAttribute("name") || this.getSelector(form)
        : "unknown";
      const fieldName =
        (target as HTMLInputElement).name ||
        target.id ||
        this.getSelector(target);

      if (!this.formStates.has(formId)) {
        this.formStates.set(formId, {
          fields: new Set(),
          startedAt: this.now(),
        });
      }
      this.formStates.get(formId)!.fields.add(fieldName);

      this.push("form", {
        action: "field_focus",
        formId,
        fieldName,
        url: location.href,
      });
    };

    const submitHandler = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const formId =
        form.id || form.getAttribute("name") || this.getSelector(form);

      this.push("form", {
        action: "submit",
        formId,
        url: location.href,
        fieldCount: this.formStates.get(formId)?.fields.size || 0,
        timeSpent: this.formStates.has(formId)
          ? this.now() - this.formStates.get(formId)!.startedAt
          : 0,
      });

      this.formStates.delete(formId);
    };

    document.addEventListener("focusin", focusHandler, true);
    document.addEventListener("submit", submitHandler, true);
    this.observers.push(() => {
      document.removeEventListener("focusin", focusHandler, true);
      document.removeEventListener("submit", submitHandler, true);
    });
  }

  // --- JS Errors ---

  private trackErrors(): void {
    const errorHandler = (e: ErrorEvent) => {
      this.push("error", {
        message: e.message,
        source: e.filename,
        line: e.lineno,
        col: e.colno,
        url: location.href,
      });
    };

    const rejectionHandler = (e: PromiseRejectionEvent) => {
      this.push("error", {
        message: String(e.reason),
        source: "unhandled_promise_rejection",
        url: location.href,
      });
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", rejectionHandler);
    this.observers.push(() => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    });
  }

  // --- Web Vitals (no dependency) ---

  private trackVitals(): void {
    // LCP
    if (typeof PerformanceObserver !== "undefined") {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1] as any;
          if (last) {
            this.push("vitals", {
              metric: "lcp",
              value: Math.round(last.startTime),
              url: location.href,
            });
          }
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
        this.observers.push(() => lcpObserver.disconnect());
      } catch (_) {}

      // FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entry = list.getEntries()[0] as any;
          if (entry) {
            this.push("vitals", {
              metric: "fid",
              value: Math.round(entry.processingStart - entry.startTime),
              url: location.href,
            });
          }
        });
        fidObserver.observe({ type: "first-input", buffered: true });
        this.observers.push(() => fidObserver.disconnect());
      } catch (_) {}

      // CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        clsObserver.observe({ type: "layout-shift", buffered: true });
        this.observers.push(() => {
          clsObserver.disconnect();
          if (clsValue > 0) {
            this.push("vitals", {
              metric: "cls",
              value: Math.round(clsValue * 1000) / 1000,
              url: location.href,
            });
          }
        });
      } catch (_) {}
    }
  }

  // --- SPA Navigation ---

  private trackNavigation(): void {
    let lastUrl = location.href;

    const checkNavigation = () => {
      if (location.href !== lastUrl) {
        // Emit scroll depth for previous page
        if (this.maxScrollDepth > 0) {
          this.push("scroll", {
            maxDepth: this.maxScrollDepth,
            url: lastUrl,
          });
        }

        // Emit time on page for previous page
        this.push("page_leave", {
          url: lastUrl,
          timeOnPage: this.now() - this.pageEnteredAt,
        });

        lastUrl = location.href;
        this.currentUrl = location.href;
        this.maxScrollDepth = 0;
        this.pageEnteredAt = this.now();
        this.trackPageview();
      }
    };

    // Listen for pushState/replaceState (SPA navigation)
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function (...args) {
      origPushState.apply(this, args);
      checkNavigation();
    };

    history.replaceState = function (...args) {
      origReplaceState.apply(this, args);
      checkNavigation();
    };

    window.addEventListener("popstate", checkNavigation);
    this.observers.push(() => {
      window.removeEventListener("popstate", checkNavigation);
      history.pushState = origPushState;
      history.replaceState = origReplaceState;
    });
  }

  // --- Batch Sending ---

  private setupBatchSending(): void {
    this.batchInterval = setInterval(() => {
      this.sendBatch();
    }, 10000);
  }

  private setupUnloadHandler(): void {
    const sendFinalBatch = () => {
      if (this.batchInterval) {
        clearInterval(this.batchInterval);
        this.batchInterval = null;
      }

      // Flush scroll depth and time on page
      if (this.maxScrollDepth > 0) {
        this.push("scroll", {
          maxDepth: this.maxScrollDepth,
          url: location.href,
        });
      }
      this.push("page_leave", {
        url: location.href,
        timeOnPage: this.now() - this.pageEnteredAt,
      });

      // Flush form abandonments
      for (const [formId, state] of this.formStates) {
        this.push("form", {
          action: "abandon",
          formId,
          url: location.href,
          fieldCount: state.fields.size,
          timeSpent: this.now() - state.startedAt,
        });
      }
      this.formStates.clear();

      // Disconnect all observers
      for (const cleanup of this.observers) {
        try {
          cleanup();
        } catch (_) {}
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

  private sendBatch(isFinal = false): void {
    if (this.events.length === 0) return;

    const eventsToSend = this.events.splice(0);
    const url = `${this.apiUrl}/api/events`;
    const payload = JSON.stringify({
      sessionId: this.sessionId,
      projectId: this.projectId,
      events: eventsToSend,
    });

    if (isFinal && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(url, payload);
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: isFinal,
    }).catch(() => {
      // Re-queue on failure (unless final)
      if (!isFinal) {
        this.events.unshift(...eventsToSend);
      }
    });
  }

  // --- Utilities ---

  private getSelector(el: Element): string {
    if (el.id) return `#${el.id}`;
    const tag = el.tagName.toLowerCase();
    const cls = Array.from(el.classList)
      .filter((c) => !c.startsWith("rr-"))
      .slice(0, 2)
      .join(".");
    const parent = el.parentElement;
    let index = "";
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === el.tagName
      );
      if (siblings.length > 1) {
        index = `:nth-child(${Array.from(parent.children).indexOf(el) + 1})`;
      }
    }
    return `${tag}${cls ? "." + cls : ""}${index}`;
  }

  private isFormField(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      el.getAttribute("contenteditable") === "true"
    );
  }

  public stop(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    for (const cleanup of this.observers) {
      try {
        cleanup();
      } catch (_) {}
    }
    this.observers = [];
  }
}

// --- Auto-init from script tag ---

function initTracker(): void {
  let script = document.currentScript as HTMLScriptElement | null;

  if (!script) {
    const scripts =
      document.querySelectorAll<HTMLScriptElement>("script[data-project-id]");
    if (scripts.length > 0) {
      script = scripts[scripts.length - 1];
    }
  }

  if (!script) return;

  const projectId = script.getAttribute("data-project-id");
  if (!projectId) return;

  const apiUrl = script.getAttribute("data-api-url") || "";

  new ReevTracker({ projectId, apiUrl });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTracker);
  } else {
    initTracker();
  }
}
