/**
 * Reev Tracker v2.0
 *
 * UX issue detection + event tracking + contextual feedback collection.
 * Includes: rage clicks, dead links, broken images, form frustration,
 * scroll depth, vitals, errors, and inline feedback popovers.
 */

interface TrackerConfig {
  projectId: string;
  apiUrl?: string;
  // Feature toggles
  rageClick?: boolean;
  deadLink?: boolean;
  brokenImage?: boolean;
  formFrustration?: boolean;
  popover?: boolean;
  popoverTheme?: 'dark' | 'light';
  maxPopupsPerSession?: number;
  popoverCooldown?: number;
  debug?: boolean;
}

interface TrackerEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
}

interface UXIssue {
  type: 'rage_click' | 'dead_link' | 'broken_image' | 'form_frustration';
  severity: 'high' | 'medium' | 'low';
  element: Element;
  selector: string;
  url?: string;
  metadata: Record<string, any>;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// POPOVER STYLES
// ═══════════════════════════════════════════════════════════════════════════

const DARK_VARS = `
  --uxs-bg: #161a24;
  --uxs-bg-input: #11141b;
  --uxs-border: #3a4158;
  --uxs-text: #e2e6f0;
  --uxs-text-sec: #7a829e;
  --uxs-text-muted: #4a5170;
`;

const LIGHT_VARS = `
  --uxs-bg: #ffffff;
  --uxs-bg-input: #f5f6f8;
  --uxs-border: #d1d5db;
  --uxs-text: #1f2937;
  --uxs-text-sec: #6b7280;
  --uxs-text-muted: #9ca3af;
`;

const POPOVER_CSS = `
.uxs-popover {
  --uxs-amber: #f0a830;
  --uxs-amber-dim: #c8891a;
  --uxs-red: #e84855;
  --uxs-green: #3dd68c;
  --uxs-blue: #4e9af5;
  --uxs-radius: 10px;

  position: fixed;
  z-index: 2147483647;
  width: 310px;
  background: var(--uxs-bg);
  border: 1px solid var(--uxs-border);
  border-radius: var(--uxs-radius);
  box-shadow: 0 12px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  opacity: 0;
  pointer-events: none;
  transform-origin: var(--uxs-origin, center top);
  transform: scale(0.9);
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: visible;
}
.uxs-popover.uxs-visible {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}
.uxs-arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--uxs-bg);
  border: 1px solid var(--uxs-border);
  transform: rotate(45deg);
  z-index: 1;
}
.uxs-placement-bottom .uxs-arrow {
  top: -7px;
  border-right: none;
  border-bottom: none;
}
.uxs-placement-top .uxs-arrow {
  bottom: -7px;
  border-left: none;
  border-top: none;
}
.uxs-stripe { height: 3px; position: relative; z-index: 2; border-radius: var(--uxs-radius) var(--uxs-radius) 0 0; }
.uxs-stripe-red { background: var(--uxs-red); }
.uxs-stripe-amber { background: var(--uxs-amber); }
.uxs-stripe-green { background: var(--uxs-green); }
.uxs-stripe-blue { background: var(--uxs-blue); }
.uxs-close {
  position: absolute;
  top: 12px;
  right: 10px;
  width: 22px;
  height: 22px;
  background: transparent;
  border: 1px solid var(--uxs-border);
  border-radius: 4px;
  color: var(--uxs-text-muted);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  line-height: 1;
  padding: 0;
}
.uxs-close:hover {
  color: var(--uxs-text);
  border-color: var(--uxs-text-sec);
}
.uxs-header {
  padding: 14px 16px 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.uxs-emoji { font-size: 20px; line-height: 1; flex-shrink: 0; }
.uxs-header-text { padding-right: 22px; }
.uxs-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 3px;
  color: var(--uxs-text);
}
.uxs-desc {
  font-size: 12px;
  color: var(--uxs-text-sec);
  line-height: 1.45;
  margin: 0;
}
.uxs-body { padding: 0 16px 10px; }
.uxs-textarea {
  width: 100%;
  background: var(--uxs-bg-input);
  border: 1px solid var(--uxs-border);
  border-radius: 6px;
  padding: 8px 10px;
  color: var(--uxs-text);
  font-family: inherit;
  font-size: 12px;
  resize: none;
  height: 48px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.uxs-textarea:focus {
  border-color: var(--uxs-amber);
}
.uxs-textarea::placeholder {
  color: var(--uxs-text-muted);
}
.uxs-actions {
  display: flex;
  gap: 6px;
  padding: 0 16px 14px;
}
.uxs-btn {
  flex: 1;
  padding: 7px 12px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.uxs-btn-send {
  background: var(--uxs-amber);
  color: #0a0c10;
  border-color: var(--uxs-amber);
}
.uxs-btn-send:hover {
  background: var(--uxs-amber-dim);
  border-color: var(--uxs-amber-dim);
}
.uxs-btn-dismiss {
  background: transparent;
  color: var(--uxs-text-sec);
  border-color: var(--uxs-border);
}
.uxs-btn-dismiss:hover {
  color: var(--uxs-text);
  border-color: var(--uxs-text-sec);
}
.uxs-highlight {
  outline: 2px solid var(--uxs-amber, #f0a830) !important;
  outline-offset: 3px;
  border-radius: 4px;
  animation: uxs-ring-pulse 1.5s ease-in-out infinite;
}
@keyframes uxs-ring-pulse {
  0%, 100% { outline-color: #f0a830; }
  50% { outline-color: rgba(240,168,48,0.3); }
}
@media (max-width: 400px) {
  .uxs-popover {
    width: calc(100vw - 24px) !important;
    left: 12px !important;
    right: 12px !important;
  }
}
`;

const BADGE_CSS = `
.uxs-badge {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #f0a830;
  color: #0a0c10;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2147483646;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1;
  border: 2px solid #fff;
  transition: transform 0.15s ease;
  animation: uxs-badge-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
}
.uxs-badge:hover {
  transform: scale(1.15);
}
.uxs-badge-red { background: #e84855; color: #fff; }
@keyframes uxs-badge-pop {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
`;

const POPOVER_HTML = `
<div class="uxs-arrow"></div>
<div class="uxs-stripe"></div>
<button class="uxs-close" aria-label="Dismiss">&times;</button>
<div class="uxs-header">
  <span class="uxs-emoji"></span>
  <div class="uxs-header-text">
    <h4 class="uxs-title"></h4>
    <p class="uxs-desc"></p>
  </div>
</div>
<div class="uxs-body">
  <textarea class="uxs-textarea" placeholder="What were you trying to do?" rows="2"></textarea>
</div>
<div class="uxs-actions">
  <button class="uxs-btn uxs-btn-dismiss">Dismiss</button>
  <button class="uxs-btn uxs-btn-send">Send</button>
</div>
`;

const ISSUE_CONFIG: Record<string, { emoji: string; color: string; title: string; desc: (issue: UXIssue) => string; placeholder: string }> = {
  rage_click: {
    emoji: '😤',
    color: 'amber',
    title: 'Not working?',
    desc: () => 'We noticed you clicked multiple times. What were you expecting to happen?',
    placeholder: 'e.g. The button didn\u2019t respond\u2026',
  },
  dead_link: {
    emoji: '🔗',
    color: 'red',
    title: 'Broken link',
    desc: (issue) => `This link seems broken (${issue.metadata?.status || 'error'}). Where were you trying to go?`,
    placeholder: 'e.g. I was trying to reach\u2026',
  },
  broken_image: {
    emoji: '🖼️',
    color: 'green',
    title: 'Missing image',
    desc: () => 'An image didn\u2019t load here. Is this causing problems?',
    placeholder: 'e.g. I can\u2019t see the product photo\u2026',
  },
  form_frustration: {
    emoji: '📝',
    color: 'blue',
    title: 'Form trouble?',
    desc: () => 'This form seems frustrating. What\u2019s confusing?',
    placeholder: 'e.g. The validation keeps rejecting\u2026',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// POPOVER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class Popover {
  private el: HTMLElement | null = null;
  private currentAnchor: Element | null = null;
  private currentIssue: UXIssue | null = null;
  private triggerElement: Element | null = null;
  private shownCount = 0;
  private lastShown = 0;
  private stylesInjected = false;
  private config: {
    maxPerSession: number;
    cooldown: number;
    theme: 'dark' | 'light';
    onFeedback: ((feedback: any) => void) | null;
  };

  constructor(options: { maxPerSession?: number; cooldown?: number; theme?: 'dark' | 'light'; onFeedback?: (fb: any) => void }) {
    this.config = {
      maxPerSession: options.maxPerSession ?? 5,
      cooldown: options.cooldown ?? 30000,
      theme: options.theme || 'dark',
      onFeedback: options.onFeedback || null,
    };
  }

  private injectStyles(): void {
    if (this.stylesInjected) return;
    this.stylesInjected = true;

    const vars = this.config.theme === 'light' ? LIGHT_VARS : DARK_VARS;
    const style = document.createElement('style');
    style.id = 'reev-popover-styles';
    style.textContent = `.uxs-popover { ${vars} }\n${POPOVER_CSS}`;
    document.head.appendChild(style);
  }

  private ensureDOM(): void {
    if (this.el) return;
    this.injectStyles();

    this.el = document.createElement('div');
    this.el.className = 'uxs-popover';
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-label', 'User feedback');
    this.el.setAttribute('aria-modal', 'true');
    this.el.innerHTML = POPOVER_HTML;
    document.body.appendChild(this.el);

    this.el.querySelector('.uxs-close')?.addEventListener('click', () => this.dismiss());
    this.el.querySelector('.uxs-btn-dismiss')?.addEventListener('click', () => this.dismiss());
    this.el.querySelector('.uxs-btn-send')?.addEventListener('click', () => this.submit());
  }

  show(issue: UXIssue): boolean {
    const now = Date.now();
    if (this.shownCount >= this.config.maxPerSession) return false;
    if (now - this.lastShown < this.config.cooldown) return false;
    if (!issue.element || !issue.element.getBoundingClientRect) return false;

    this.dismiss();
    this.ensureDOM();

    const cfg = ISSUE_CONFIG[issue.type] || {
      emoji: '⚠️',
      color: 'amber',
      title: 'Issue Detected',
      desc: () => 'Something went wrong.',
      placeholder: 'What were you trying to do?',
    };

    if (this.el) {
      const emoji = this.el.querySelector('.uxs-emoji');
      const title = this.el.querySelector('.uxs-title');
      const desc = this.el.querySelector('.uxs-desc');
      const textarea = this.el.querySelector('.uxs-textarea') as HTMLTextAreaElement;
      const stripe = this.el.querySelector('.uxs-stripe');

      if (emoji) emoji.textContent = cfg.emoji;
      if (title) title.textContent = cfg.title;
      if (desc) desc.textContent = cfg.desc(issue);
      if (textarea) {
        textarea.value = '';
        textarea.placeholder = cfg.placeholder;
      }
      if (stripe) stripe.className = `uxs-stripe uxs-stripe-${cfg.color}`;
    }

    this.currentAnchor = issue.element;
    this.currentIssue = issue;
    this.triggerElement = document.activeElement;
    this.shownCount++;
    this.lastShown = now;

    this.currentAnchor.classList.add('uxs-highlight');
    this.position();
    requestAnimationFrame(() => {
      this.el?.classList.add('uxs-visible');
      // Auto-focus textarea
      const ta = this.el?.querySelector('.uxs-textarea') as HTMLTextAreaElement | null;
      ta?.focus();
    });

    document.addEventListener('mousedown', this.onOutsideClick);
    document.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('scroll', this.reposition, true);
    window.addEventListener('resize', this.reposition);

    return true;
  }

  dismiss(): void {
    if (!this.el || !this.el.classList.contains('uxs-visible')) return;
    this.el.classList.remove('uxs-visible');

    if (this.currentAnchor) {
      this.currentAnchor.classList.remove('uxs-highlight');
    }

    document.removeEventListener('mousedown', this.onOutsideClick);
    document.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);

    // Restore focus to the element that was focused before popover opened
    if (this.triggerElement && (this.triggerElement as HTMLElement).focus) {
      (this.triggerElement as HTMLElement).focus();
    }

    this.currentAnchor = null;
    this.currentIssue = null;
    this.triggerElement = null;
  }

  destroy(): void {
    this.dismiss();
    if (this.el) {
      this.el.remove();
      this.el = null;
    }
  }

  private submit(): void {
    const textarea = this.el?.querySelector('.uxs-textarea') as HTMLTextAreaElement;
    const text = textarea?.value.trim() || '';

    if (this.config.onFeedback && this.currentIssue) {
      this.config.onFeedback({
        issue: {
          type: this.currentIssue.type,
          severity: this.currentIssue.severity,
          selector: this.currentIssue.selector,
          url: this.currentIssue.url,
          metadata: this.currentIssue.metadata,
        },
        message: text,
        timestamp: new Date().toISOString(),
        pageUrl: location.href,
      });
    }

    this.dismiss();
  }

  private position(): void {
    if (!this.currentAnchor || !this.el) return;

    const anchor = this.currentAnchor;
    const pop = this.el;
    const arrow = pop.querySelector('.uxs-arrow') as HTMLElement;
    const rect = anchor.getBoundingClientRect();
    const popW = window.innerWidth <= 400 ? window.innerWidth - 24 : 310;
    const gap = 10;

    pop.style.visibility = 'hidden';
    pop.style.left = '-9999px';
    pop.classList.add('uxs-visible');
    const popH = pop.offsetHeight;
    pop.classList.remove('uxs-visible');
    pop.style.visibility = '';

    const spaceBelow = window.innerHeight - rect.bottom;
    const placement = spaceBelow > popH + gap + 20 ? 'bottom' : 'top';

    pop.classList.remove('uxs-placement-bottom', 'uxs-placement-top');
    pop.classList.add(`uxs-placement-${placement}`);

    let left = rect.left + rect.width / 2 - popW / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - popW - 10));

    let top: number;
    if (placement === 'bottom') {
      top = rect.bottom + gap;
      pop.style.setProperty('--uxs-origin', 'center top');
    } else {
      top = rect.top - gap - popH;
      top = Math.max(10, top);
      pop.style.setProperty('--uxs-origin', 'center bottom');
    }

    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;

    if (arrow) {
      const arrowX = rect.left + rect.width / 2 - left - 6;
      arrow.style.left = `${Math.max(18, Math.min(arrowX, popW - 30))}px`;
    }
  }

  private reposition = (): void => {
    if (this.currentAnchor && this.el?.classList.contains('uxs-visible')) {
      this.position();
    }
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.el) return;

    if (e.key === 'Escape') {
      this.dismiss();
      return;
    }

    // Focus trap: Tab cycles through textarea → dismiss → send → close
    if (e.key === 'Tab') {
      const focusable = this.el.querySelectorAll<HTMLElement>(
        'textarea, button'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  private onOutsideClick = (e: MouseEvent): void => {
    if (!this.el) return;
    if (this.el.contains(e.target as Node)) return;
    if (this.currentAnchor?.contains(e.target as Node)) return;
    this.dismiss();
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TRACKER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class ReevTracker {
  private projectId: string;
  private apiUrl: string;
  private sessionId: string;
  private events: TrackerEvent[] = [];
  private batchInterval: ReturnType<typeof setInterval> | null = null;
  private maxScrollDepth = 0;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private pageEnteredAt: number = Date.now();
  private observers: (() => void)[] = [];
  private config: Required<Omit<TrackerConfig, 'projectId' | 'apiUrl'>>;
  private popover: Popover | null = null;

  // Rage click tracking
  private clickTracker: Map<Element, number[]> = new Map();
  private rageClickCooldowns: WeakSet<Element> = new WeakSet();

  // Dead link tracking
  private checkedLinks: WeakSet<Element> = new WeakSet();

  // Broken image tracking
  private reportedImages: WeakSet<Element> = new WeakSet();

  // Indicator badges for passive detections
  private badges: HTMLElement[] = [];

  // Form frustration tracking
  private formFields: Map<Element, { clears: number; peakLen: number; timer: ReturnType<typeof setTimeout> }> = new Map();
  private formFrustrationCooldowns: WeakSet<Element> = new WeakSet();

  // Form states for submit/abandon tracking
  private formStates: Map<string, { fields: Set<string>; startedAt: number }> = new Map();

  // Context capture — ring buffers for enriching reports
  private recentErrors: Array<{ message: string; source?: string; line?: number; timestamp: number }> = [];
  private breadcrumbs: Array<{ action: string; target?: string; url?: string; timestamp: number }> = [];
  private static readonly MAX_ERRORS = 5;
  private static readonly MAX_BREADCRUMBS = 10;

  // Screenshot captured at issue detection time
  private pendingScreenshot: string | null = null;

  constructor(config: TrackerConfig) {
    this.projectId = config.projectId;
    this.apiUrl = config.apiUrl || '';
    this.sessionId = this.generateSessionId();

    this.config = {
      rageClick: config.rageClick ?? true,
      deadLink: config.deadLink ?? true,
      brokenImage: config.brokenImage ?? true,
      formFrustration: config.formFrustration ?? true,
      popover: config.popover ?? true,
      popoverTheme: config.popoverTheme ?? 'dark',
      maxPopupsPerSession: config.maxPopupsPerSession ?? 5,
      popoverCooldown: config.popoverCooldown ?? 30000,
      debug: config.debug ?? false,
    };

    this.init();
  }

  private generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private now(): number {
    return Date.now();
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Reev]', ...args);
    }
  }

  // Only send feedback reports. Detection runs client-side;
  // nothing ships until the user actually submits feedback.
  private static readonly SEND_TYPES = new Set(['ux_feedback']);

  private push(type: string, data: Record<string, any>): void {
    if (!ReevTracker.SEND_TYPES.has(type)) return;
    this.events.push({ type, data, timestamp: this.now() });
  }

  private init(): void {
    try {
      // Inject badge styles (independent of popover)
      if (!document.getElementById('reev-badge-styles')) {
        const style = document.createElement('style');
        style.id = 'reev-badge-styles';
        style.textContent = BADGE_CSS;
        document.head.appendChild(style);
      }

      // Setup popover
      if (this.config.popover) {
        this.popover = new Popover({
          maxPerSession: this.config.maxPopupsPerSession,
          cooldown: this.config.popoverCooldown,
          theme: this.config.popoverTheme,
          onFeedback: (fb) => this.handleFeedback(fb),
        });
      }

      // Core tracking
      this.trackPageview();
      this.trackClicks();
      this.trackScroll();
      this.trackForms();
      this.trackErrors();
      this.trackVitals();
      this.trackNavigation();

      // UX Issue detection
      if (this.config.deadLink) this.trackDeadLinks();
      if (this.config.brokenImage) this.trackBrokenImages();
      if (this.config.formFrustration) this.trackFormFrustration();

      this.setupBatchSending();
      this.setupUnloadHandler();

      this.log('Initialized', { sessionId: this.sessionId, config: this.config });
    } catch (_) {
      // silent fail — tracker should never break the host page
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ISSUE HANDLING
  // ─────────────────────────────────────────────────────────────────────────

  private handleIssue(issue: UXIssue): void {
    this.log('Issue detected', issue);

    // Capture screenshot at the moment of frustration (before popover changes DOM)
    this.pendingScreenshot = null;
    this.captureScreenshot(issue.element).then((img) => { this.pendingScreenshot = img; });

    // Send to API
    this.push('ux_issue', {
      issueType: issue.type,
      severity: issue.severity,
      selector: issue.selector,
      url: issue.url,
      metadata: issue.metadata,
      pageUrl: location.href,
    });

    // Show popover
    if (this.popover) {
      this.popover.show(issue);
    }
  }

  private handleFeedback(feedback: any): void {
    this.log('Feedback received', feedback);

    const element = feedback.issue?.selector
      ? document.querySelector(feedback.issue.selector)
      : null;

    this.push('ux_feedback', {
      issueType: feedback.issue?.type,
      issueSeverity: feedback.issue?.severity,
      issueSelector: feedback.issue?.selector,
      message: feedback.message,
      pageUrl: feedback.pageUrl,
      deviceType: this.detectDevice(),
      browserName: this.detectBrowser(),
      // Enriched context
      timeOnPage: Math.round((this.now() - this.pageEnteredAt) / 1000),
      screenshot: this.pendingScreenshot,
      domSnapshot: this.captureDomSnapshot(element),
      consoleErrors: this.recentErrors.slice(),
      breadcrumbs: this.breadcrumbs.slice(),
    });

    this.pendingScreenshot = null;

    // Also send immediately for feedback
    this.sendBatch();
  }

  private detectDevice(): string {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  private detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Other';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE VIEWS
  // ─────────────────────────────────────────────────────────────────────────

  private trackPageview(): void {
    this.pageEnteredAt = this.now();
    this.maxScrollDepth = 0;
    this.push('pageview', {
      url: location.href,
      referrer: document.referrer,
      title: document.title,
      viewport: { w: window.innerWidth, h: window.innerHeight },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CLICKS & RAGE CLICKS
  // ─────────────────────────────────────────────────────────────────────────

  private trackClicks(): void {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target) return;

      const selector = this.getSelector(target);
      const text = (target.textContent || '').trim().slice(0, 100);
      const now = this.now();

      // Rage click detection — only on interactive elements
      let isRage = false;
      if (this.config.rageClick && this.isInteractive(target) && !this.rageClickCooldowns.has(target)) {
        if (!this.clickTracker.has(target)) {
          this.clickTracker.set(target, []);
        }

        const times = this.clickTracker.get(target)!;
        times.push(now);

        // Prune clicks outside 1.5s window
        const cutoff = now - 1500;
        while (times.length && times[0] < cutoff) {
          times.shift();
        }

        if (times.length >= 3) {
          isRage = true;
          this.rageClickCooldowns.add(target);
          setTimeout(() => this.rageClickCooldowns.delete(target), 5000);
          this.clickTracker.delete(target);

          this.handleIssue({
            type: 'rage_click',
            severity: 'medium',
            element: target,
            selector,
            metadata: {
              clickCount: times.length,
              windowMs: 1500,
              avgInterval: Math.round(1500 / times.length),
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Record breadcrumb
      this.addBreadcrumb('click', selector, text);

      this.push('click', {
        selector,
        text,
        x: e.clientX,
        y: e.clientY,
        isRage,
        url: location.href,
      });
    };

    document.addEventListener('click', handler, true);
    this.observers.push(() => document.removeEventListener('click', handler, true));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DEAD LINK DETECTION
  // ─────────────────────────────────────────────────────────────────────────

  private trackDeadLinks(): void {
    // Scan all links on the page proactively
    this.scanLinks();

    // Also watch for dynamically added links (SPA navigation)
    const observer = new MutationObserver(() => {
      this.scanLinks();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    this.observers.push(() => observer.disconnect());
  }

  private scanLinks(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href]');
    for (const link of links) {
      if (this.checkedLinks.has(link)) continue;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }

      try {
        const url = new URL(href, window.location.origin);
        // Only probe same-origin links (cross-origin would be blocked by CORS)
        if (url.origin !== window.location.origin) continue;
      } catch {
        continue;
      }

      this.checkedLinks.add(link);
      this.probeLink(link, href);
    }
  }

  private async probeLink(el: HTMLAnchorElement, href: string): Promise<void> {
    try {
      const url = new URL(href, window.location.origin);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url.href, {
        method: 'HEAD',
        mode: 'same-origin',
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        this.log('Dead link found:', href, response.status);
        this.reportDeadLink(el, href, response.status);
      }
    } catch (err: any) {
      const status = err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
      this.log('Dead link found:', href, status);
      this.reportDeadLink(el, href, status);
    }
  }

  private addIndicator(el: Element, issue: UXIssue, colorClass?: string): void {
    this.log('Adding indicator badge', issue.type, issue.selector);
    const parent = el.parentElement;
    if (!parent) return;

    // Make parent a positioning context
    const parentPos = window.getComputedStyle(parent).position;
    if (parentPos === 'static') {
      (parent as HTMLElement).style.position = 'relative';
    }

    // Calculate element's top-right corner relative to parent
    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const top = elRect.top - parentRect.top - 4;
    const left = elRect.right - parentRect.left - 16;

    const badge = document.createElement('div');
    badge.className = `uxs-badge${colorClass ? ` ${colorClass}` : ''}`;
    badge.textContent = '?';
    badge.style.top = `${Math.max(0, top)}px`;
    badge.style.left = `${Math.max(0, left)}px`;
    badge.title = issue.type === 'dead_link'
      ? 'Broken link — click to report'
      : 'Missing image — click to report';

    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      badge.remove();
      this.handleIssue(issue);
    });

    parent.appendChild(badge);
    this.badges.push(badge);
  }

  private reportDeadLink(el: HTMLAnchorElement, url: string, status: number | string): void {
    const issue: UXIssue = {
      type: 'dead_link',
      severity: 'high',
      element: el,
      selector: this.getSelector(el),
      url,
      metadata: { status },
      timestamp: new Date().toISOString(),
    };
    this.addIndicator(el, issue, 'uxs-badge-red');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BROKEN IMAGE DETECTION
  // ─────────────────────────────────────────────────────────────────────────

  private trackBrokenImages(): void {
    // Check a single image — handles all timing scenarios
    const checkImage = (img: HTMLImageElement) => {
      if (this.reportedImages.has(img)) return;
      if (!img.src && !img.getAttribute('src')) return;

      if (img.complete) {
        // Already finished loading — check if broken
        if (img.naturalWidth === 0) {
          this.reportedImages.add(img);
          this.log('Broken image detected:', img.src || img.getAttribute('src'));
          this.reportBrokenImage(img);
        }
      } else {
        // Still loading — attach individual error handler
        img.addEventListener('error', () => {
          if (this.reportedImages.has(img)) return;
          this.reportedImages.add(img);
          this.log('Broken image detected (onerror):', img.src);
          this.reportBrokenImage(img);
        }, { once: true });
      }
    };

    // Scan all current images
    document.querySelectorAll<HTMLImageElement>('img').forEach(checkImage);

    // Re-scan after window load — guarantees all images have resolved
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        document.querySelectorAll<HTMLImageElement>('img').forEach(checkImage);
      }, { once: true });
    }

    // Watch for dynamically added images (SPA navigation)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.tagName === 'IMG') {
            checkImage(node as HTMLImageElement);
          }
          node.querySelectorAll?.('img').forEach(checkImage);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    this.observers.push(() => observer.disconnect());
  }

  private reportBrokenImage(el: HTMLImageElement): void {
    const issue: UXIssue = {
      type: 'broken_image',
      severity: 'low',
      element: el,
      selector: this.getSelector(el),
      url: el.src || el.currentSrc || '',
      metadata: {
        alt: el.alt || '',
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
      },
      timestamp: new Date().toISOString(),
    };
    this.addIndicator(el, issue);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FORM FRUSTRATION DETECTION
  // ─────────────────────────────────────────────────────────────────────────

  private trackFormFrustration(): void {
    const handler = (e: Event) => {
      const el = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (!this.isFormField(el)) return;
      if (this.formFrustrationCooldowns.has(el)) return;

      const len = (el.value || '').length;

      if (!this.formFields.has(el)) {
        this.formFields.set(el, {
          clears: 0,
          peakLen: len,
          timer: setTimeout(() => this.formFields.delete(el), 30000),
        });
        return;
      }

      const data = this.formFields.get(el)!;

      // Track the highest length the field reached
      if (len > data.peakLen) {
        data.peakLen = len;
      }

      // Detect clear: field was at 3+ chars at some point and is now empty
      // Works with both select-all+delete AND gradual backspacing
      if (len === 0 && data.peakLen >= 3) {
        data.clears++;
        data.peakLen = 0;

        clearTimeout(data.timer);
        data.timer = setTimeout(() => this.formFields.delete(el), 30000);

        if (data.clears >= 2) {
          this.formFrustrationCooldowns.add(el);
          setTimeout(() => this.formFrustrationCooldowns.delete(el), 60000);
          this.formFields.delete(el);

          this.handleIssue({
            type: 'form_frustration',
            severity: 'medium',
            element: el,
            selector: this.getSelector(el),
            metadata: {
              fieldType: el.type || 'text',
              fieldName: el.name || el.id || '',
              clearCount: data.clears,
              pattern: 'repeated_clear_retype',
            },
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    document.addEventListener('input', handler, true);
    this.observers.push(() => document.removeEventListener('input', handler, true));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL DEPTH
  // ─────────────────────────────────────────────────────────────────────────

  private trackScroll(): void {
    const handler = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const viewportHeight = window.innerHeight;
      const maxScroll = docHeight - viewportHeight;

      if (maxScroll <= 0) return;

      const depth = Math.min(100, Math.round((scrollTop / maxScroll) * 100));

      if (depth > this.maxScrollDepth) {
        this.maxScrollDepth = depth;
      }

      if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.push('scroll', {
          maxDepth: this.maxScrollDepth,
          url: location.href,
        });
      }, 500);
    };

    window.addEventListener('scroll', handler, { passive: true });
    this.observers.push(() => window.removeEventListener('scroll', handler));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FORM INTERACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  private trackForms(): void {
    const focusHandler = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!this.isFormField(target)) return;

      const form = (target as HTMLInputElement).form;
      const formId = form
        ? form.id || form.getAttribute('name') || this.getSelector(form)
        : 'unknown';
      const fieldName = (target as HTMLInputElement).name || target.id || this.getSelector(target);

      if (!this.formStates.has(formId)) {
        this.formStates.set(formId, {
          fields: new Set(),
          startedAt: this.now(),
        });
      }
      this.formStates.get(formId)!.fields.add(fieldName);

      this.push('form', {
        action: 'field_focus',
        formId,
        fieldName,
        url: location.href,
      });
    };

    const submitHandler = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const formId = form.id || form.getAttribute('name') || this.getSelector(form);

      this.push('form', {
        action: 'submit',
        formId,
        url: location.href,
        fieldCount: this.formStates.get(formId)?.fields.size || 0,
        timeSpent: this.formStates.has(formId)
          ? this.now() - this.formStates.get(formId)!.startedAt
          : 0,
      });

      this.formStates.delete(formId);
    };

    document.addEventListener('focusin', focusHandler, true);
    document.addEventListener('submit', submitHandler, true);
    this.observers.push(() => {
      document.removeEventListener('focusin', focusHandler, true);
      document.removeEventListener('submit', submitHandler, true);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // JS ERRORS
  // ─────────────────────────────────────────────────────────────────────────

  private trackErrors(): void {
    const errorHandler = (e: ErrorEvent) => {
      this.captureError(e.message, e.filename, e.lineno);
      this.push('error', {
        message: e.message,
        source: e.filename,
        line: e.lineno,
        col: e.colno,
        url: location.href,
      });
    };

    const rejectionHandler = (e: PromiseRejectionEvent) => {
      this.captureError(String(e.reason), 'unhandled_promise_rejection');
      this.push('error', {
        message: String(e.reason),
        source: 'unhandled_promise_rejection',
        url: location.href,
      });
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    this.observers.push(() => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    });
  }

  private captureError(message: string, source?: string, line?: number): void {
    this.recentErrors.push({ message, source, line, timestamp: this.now() });
    if (this.recentErrors.length > ReevTracker.MAX_ERRORS) {
      this.recentErrors.shift();
    }
  }

  private addBreadcrumb(action: string, target?: string, detail?: string): void {
    const label = detail ? `${target} (${detail.slice(0, 40)})` : target;
    this.breadcrumbs.push({ action, target: label, url: location.href, timestamp: this.now() });
    if (this.breadcrumbs.length > ReevTracker.MAX_BREADCRUMBS) {
      this.breadcrumbs.shift();
    }
  }

  private captureDomSnapshot(el: Element | null): string | null {
    if (!el) return null;
    try {
      // Walk up 1 parent for context, but never past a semantic container
      const stop = new Set(['BODY', 'HTML', 'MAIN', 'SECTION', 'ARTICLE']);
      let context = el;
      if (context.parentElement && !stop.has(context.parentElement.tagName)) {
        context = context.parentElement;
      }
      const html = context.outerHTML;
      return html.length > 1000 ? html.slice(0, 1000) + '...' : html;
    } catch {
      return null;
    }
  }

  private async loadScript(url: string, timeoutMs: number): Promise<boolean> {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      const timer = setTimeout(() => { s.remove(); resolve(false); }, timeoutMs);
      s.src = url;
      s.onload = () => { clearTimeout(timer); resolve(true); };
      s.onerror = () => { clearTimeout(timer); s.remove(); resolve(false); };
      document.head.appendChild(s);
    });
  }

  private async captureScreenshot(el: Element): Promise<string | null> {
    try {
      // Lazy-load html2canvas from CDN with fallback
      if (typeof (window as any).html2canvas === 'undefined') {
        const cdns = [
          'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
          'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
        ];
        let loaded = false;
        for (const url of cdns) {
          loaded = await this.loadScript(url, 3000);
          if (loaded) break;
        }
        if (!loaded) return null;
      }
      const h2c = (window as any).html2canvas;
      if (!h2c) return null;

      // Find a meaningful container to screenshot (the element or its parent)
      const stop = new Set(['BODY', 'HTML']);
      let target: Element = el;
      if (target.parentElement && !stop.has(target.parentElement.tagName)) {
        target = target.parentElement;
      }

      const canvas = await h2c(target, {
        scale: 0.5,
        logging: false,
        useCORS: true,
      });
      return canvas.toDataURL('image/jpeg', 0.6);
    } catch {
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // WEB VITALS
  // ─────────────────────────────────────────────────────────────────────────

  private trackVitals(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as any;
        if (last) {
          this.push('vitals', {
            metric: 'lcp',
            value: Math.round(last.startTime),
            url: location.href,
          });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(() => lcpObserver.disconnect());
    } catch (_) {}

    // FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0] as any;
        if (entry) {
          this.push('vitals', {
            metric: 'fid',
            value: Math.round(entry.processingStart - entry.startTime),
            url: location.href,
          });
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
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
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(() => {
        clsObserver.disconnect();
        if (clsValue > 0) {
          this.push('vitals', {
            metric: 'cls',
            value: Math.round(clsValue * 1000) / 1000,
            url: location.href,
          });
        }
      });
    } catch (_) {}
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SPA NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────

  private trackNavigation(): void {
    let lastUrl = location.href;

    const checkNavigation = () => {
      if (location.href !== lastUrl) {
        if (this.maxScrollDepth > 0) {
          this.push('scroll', {
            maxDepth: this.maxScrollDepth,
            url: lastUrl,
          });
        }

        this.push('page_leave', {
          url: lastUrl,
          timeOnPage: this.now() - this.pageEnteredAt,
        });

        this.addBreadcrumb('navigate', location.href);
        lastUrl = location.href;
        this.maxScrollDepth = 0;
        this.pageEnteredAt = this.now();
        this.trackPageview();
      }
    };

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

    window.addEventListener('popstate', checkNavigation);
    this.observers.push(() => {
      window.removeEventListener('popstate', checkNavigation);
      history.pushState = origPushState;
      history.replaceState = origReplaceState;
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH SENDING
  // ─────────────────────────────────────────────────────────────────────────

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

      if (this.maxScrollDepth > 0) {
        this.push('scroll', {
          maxDepth: this.maxScrollDepth,
          url: location.href,
        });
      }
      this.push('page_leave', {
        url: location.href,
        timeOnPage: this.now() - this.pageEnteredAt,
      });

      for (const [formId, state] of this.formStates) {
        this.push('form', {
          action: 'abandon',
          formId,
          url: location.href,
          fieldCount: state.fields.size,
          timeSpent: this.now() - state.startedAt,
        });
      }
      this.formStates.clear();

      for (const cleanup of this.observers) {
        try {
          cleanup();
        } catch (_) {}
      }

      if (this.popover) {
        this.popover.destroy();
      }

      this.sendBatch(true);
    };

    window.addEventListener('beforeunload', sendFinalBatch);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
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

    if (isFinal && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(url, payload);
      return;
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: isFinal,
    }).catch(() => {
      if (!isFinal) {
        this.events.unshift(...eventsToSend);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────

  private getSelector(el: Element): string {
    if (el.id) return `#${el.id}`;
    const tag = el.tagName.toLowerCase();
    const cls = Array.from(el.classList)
      .filter((c) => !c.startsWith('rr-') && !c.startsWith('uxs-'))
      .slice(0, 2)
      .join('.');
    const parent = el.parentElement;
    let index = '';
    if (parent) {
      const siblings = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
      if (siblings.length > 1) {
        index = `:nth-child(${Array.from(parent.children).indexOf(el) + 1})`;
      }
    }
    return `${tag}${cls ? '.' + cls : ''}${index}`;
  }

  private isInteractive(el: Element): boolean {
    const tag = el.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'SELECT') return true;
    if (tag === 'INPUT') {
      const type = ((el as HTMLInputElement).type || '').toLowerCase();
      return ['button', 'submit', 'reset', 'checkbox', 'radio'].includes(type);
    }
    if (el.getAttribute('role') === 'button' || el.getAttribute('tabindex') != null) return true;
    if ((el as HTMLElement).onclick != null) return true;
    const cursor = window.getComputedStyle(el).cursor;
    return cursor === 'pointer';
  }

  private isFormField(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    if (tag === 'textarea') return true;
    if (tag === 'input') {
      const type = ((el as HTMLInputElement).type || '').toLowerCase();
      return ['text', 'email', 'password', 'search', 'tel', 'url', 'number'].includes(type);
    }
    return el.getAttribute('contenteditable') === 'true';
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

    if (this.popover) {
      this.popover.destroy();
      this.popover = null;
    }

    for (const badge of this.badges) {
      badge.remove();
    }
    this.badges = [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-INIT FROM SCRIPT TAG
// ═══════════════════════════════════════════════════════════════════════════

function initTracker(): void {
  let script = document.currentScript as HTMLScriptElement | null;

  if (!script) {
    const scripts = document.querySelectorAll<HTMLScriptElement>('script[data-project-id]');
    if (scripts.length > 0) {
      script = scripts[scripts.length - 1];
    }
  }

  if (!script) return;

  const projectId = script.getAttribute('data-project-id');
  if (!projectId) return;

  const apiUrl = script.getAttribute('data-api-url') || '';

  // Parse config from data attributes
  const config: TrackerConfig = {
    projectId,
    apiUrl,
    rageClick: script.getAttribute('data-rage-click') !== 'false',
    deadLink: script.getAttribute('data-dead-link') !== 'false',
    brokenImage: script.getAttribute('data-broken-image') !== 'false',
    formFrustration: script.getAttribute('data-form-frustration') !== 'false',
    popover: script.getAttribute('data-popover') !== 'false',
    popoverTheme: (script.getAttribute('data-popover-theme') as 'dark' | 'light') || 'dark',
    maxPopupsPerSession: parseInt(script.getAttribute('data-max-popups') || '5', 10),
    popoverCooldown: parseInt(script.getAttribute('data-popover-cooldown') || '30000', 10),
    debug: script.getAttribute('data-debug') === 'true',
  };

  new ReevTracker(config);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracker);
  } else {
    initTracker();
  }
}
