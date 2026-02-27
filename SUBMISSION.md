*This is a submission for the [DEV Weekend Challenge: Community](https://dev.to/challenges/weekend-2026-02-28)*

## The Community

The **web development community**. We pour hours into building apps, but understanding *why users get frustrated* remains one of the hardest problems. Enterprise tools like FullStory and Hotjar are expensive and privacy-heavy. Indie developers, small teams, and open-source maintainers are left guessing and reading through support tickets or hoping users speak up.

Reev exists because every web developer deserves to know when their UI is failing users, without needing a six-figure analytics budget.

## What I Built

**Reev** is a lightweight, open-source UX frustration detector that automatically catches real user frustration on your website and asks them what went wrong -right in the moment.

Drop a single `<script>` tag on your site and Reev detects **4 types of UX frustration** in real time:

- **Rage Clicks** - 3+ rapid clicks on the same element within 1.5 seconds
- **Dead Links** - same-origin links that return errors or timeout
- **Broken Images** - images that fail to load, including dynamically added ones
- **Form Frustration** - users clearing and retyping the same form field repeatedly
- **Flow Suggestions** - guide frustrated users to the right page with navigation hints, created manually, auto-discovered from pageview data, or imported from your sitemap

When frustration is detected, an inline popover appears next to the problem element asking the user *"What went wrong?"*. Their feedback is sent to your dashboard with full context -browser, device, the element they interacted with, and recent errors.

The dashboard then groups repeated feedback into **patterns** -so if 5 users report the same dead link on your pricing page, you see one actionable pattern instead of 5 separate reports.

The tracker is **~7KB, zero dependencies**, and works on any website or framework.

## Demo

**Live app:** [reev.kreativekorna.com](https://reev.kreativekorna.com)

**Quick setup - add to any site in 60 seconds:**

```html
<script>
!function(c, s) {
  window.ReevConfig = c;
  s = document.createElement("script");
  s.src = "https://unpkg.com/reev.js/dist/reev.js";
  document.head.appendChild(s);
}({
  projectId: "your-project-id",
  apiUrl: "https://reev.kreativekorna.com"
})
</script>
```

## Code

{% github codellyson/reev %}

## How I Built It

**Tracker library** (`reevjs/`):

- Vanilla TypeScript compiled to a single IIFE bundle via esbuild
- Zero dependencies - uses native browser APIs (MutationObserver, PerformanceObserver)
- Configured via `window.ReevConfig` -supports toggling each detector, popover theme (dark/light), cooldowns, and debug mode
- Self-initializes on DOMContentLoaded, no method calls needed

**Dashboard & API** (`app/`):

- **Next.js 16** (App Router) with React 18 and TypeScript
- **PostgreSQL** (Neon-compatible) for event and feedback storage
- **NextAuth.js** for authentication
- **TanStack Query** for data fetching
- **Tailwind CSS** + **Framer Motion** for the UI

**How detection works:**

- The tracker detects frustration client-side and shows a feedback popover
- User feedback is sent to `POST /api/events` and stored in a dedicated feedback table
- When 2+ feedback reports share the same issue type and page URL, a **pattern** is automatically created
- The dashboard shows individual reports (`/reports`) and recurring patterns (`/patterns`), filterable by status and issue type
- A separate `/flows` page lets you manage navigation suggestions -create them manually, auto-discover common page transitions from pageview data, or import from a sitemap
- Flow widget is configurable per-project: display mode (on frustration or always), position, theme, and max suggestions

**Key architectural decisions:**

- JSONB storage for flexible event data -no schema migrations needed when adding new event types
- Ring buffers for context capture (last 5 errors, last 10 breadcrumbs) lightweight memory footprint
- Rate limiting (60 req/min per IP, max 50 events per batch, 512KB max payload) to prevent abuse
- Privacy-first: no session replay, no PII collection just enough context to fix the problem
