# Reev

UX is hard. Reev makes it simple.

Reev is a lightweight UX issue detector with real-time feedback collection. Install a script on your site, and Reev tells you what's broken — rage clicks, dead links, broken images, form frustration, slow pages, JS errors, scroll dropoff. When issues occur, users can provide instant feedback via inline popovers. No dashboards to interpret. Just a feed of problems with context, user feedback, and fix suggestions.

## How it works

```
1. Install   → Paste a <script> tag on your site
2. Detect    → Reev tracks clicks, scrolls, errors, forms, performance + UX issues
3. Collect   → Users can submit feedback when issues are detected (optional popovers)
4. Fix       → A single issues feed tells you what's wrong, what users said, and what to do
```

## The Issues Feed

The entire product is one view: a list of UX problems, grouped by severity.

Each issue shows:
- **What's wrong** — "Users are rage-clicking the Submit button"
- **Where** — `/contact`
- **Trend** — getting worse, stable, or improving
- **Suggestion** — "Check if the button has a click handler or is obscured"
- **Evidence** — click to see the sessions where it happened

When you fix something, mark it resolved. Reev tracks whether it actually improved.

## What Reev detects

| Issue | How it works | Severity |
|---|---|---|
| **Rage clicks** | 3+ clicks on the same element within 1.5 seconds | Medium |
| **Dead links** | Links that timeout or return errors when clicked | High |
| **Broken images** | Images that fail to load (scans existing + watches new) | Low |
| **Form frustration** | 3+ clear-and-retype cycles on the same field | Medium |
| **Scroll dropoff** | Average scroll depth below 30% on pages with traffic | Medium |
| **Form abandonment** | Less than 50% of users who start a form submit it | Medium |
| **Slow pages** | LCP above 2.5s or CLS above 0.25 | High |
| **Error spikes** | 3+ JavaScript errors on a page within 3 days | Critical |

Each issue is assigned a severity and tracked over time. For real-time issues (rage clicks, dead links, broken images, form frustration), users see a feedback popover where they can describe what went wrong.

## Pages

| Route | Purpose |
|---|---|
| `/issues` | Main view — issues grouped by severity with trends and suggestions |
| `/feedback` | User feedback from popover submissions, grouped by issue type |
| `/sessions` | Browse recorded sessions, filter by date/device/URL |
| `/sessions/:id` | Session detail — event timeline showing what the user did |
| `/settings` | Project config, tracker setup code, session tags |

That's it. Five routes.

## Tech stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query
- **Database**: PostgreSQL (Neon)
- **Auth**: NextAuth with credentials provider
- **Tracker**: Vanilla TypeScript, ~7KB minified, zero dependencies
- **Charts**: SVG sparklines (no charting library)
- **Background jobs**: Metrics calculation + insight detection, triggered via API

## Data flow

```
Browser (tracker.js)
  ↓ batches events every 10s
POST /api/events
  ↓ validates project, upserts session, stores events
PostgreSQL (page_events table)
  ↓ background job runs periodically
Aggregation (page_stats) → Detection (insights)
  ↓
Issues feed (GET /api/insights)
```

## Tracker events

The tracker captures 9 event types with no user configuration:

- `pageview` — URL, referrer, title, viewport
- `click` — selector, coordinates, rage click detection
- `scroll` — max scroll depth (throttled)
- `form` — field focus, submit, abandonment
- `error` — JS errors and unhandled promise rejections
- `vitals` — LCP, FID, CLS via PerformanceObserver
- `page_leave` — time on page
- `ux_issue` — real-time UX issues (rage click, dead link, broken image, form frustration)
- `ux_feedback` — user feedback submitted via popover

## Database

```sql
sessions     — one row per visitor session (duration, clicks, errors)
page_events  — all tracked events (type, url, JSONB data, timestamp)
insights     — detected issues (type, severity, trend, suggestion, metadata)
page_stats   — daily page-level aggregations (views, scroll, vitals, errors)
feedback     — user feedback from popover submissions
projects     — multi-project support
users        — auth
tags         — session labeling
```

## Setup

```bash
# Install dependencies
pnpm install

# Run database migration
pnpm migrate

# Start development server
pnpm dev
```

Add the tracker to any site:

```html
<script src="https://your-reev-instance.com/tracker.js"
        data-project-id="your-project-id"
        data-api-url="https://your-reev-instance.com">
</script>
```

### Tracker configuration

All features are enabled by default. Use data attributes to customize:

```html
<script src="https://your-reev-instance.com/tracker.js"
        data-project-id="your-project-id"
        data-api-url="https://your-reev-instance.com"
        data-rage-click="true"
        data-dead-link="true"
        data-broken-image="true"
        data-form-frustration="true"
        data-popover="true"
        data-popover-theme="dark"
        data-max-popups="5"
        data-popover-cooldown="30000"
        data-debug="false">
</script>
```

| Attribute | Default | Description |
|---|---|---|
| `data-rage-click` | `true` | Enable rage click detection |
| `data-dead-link` | `true` | Enable dead link detection |
| `data-broken-image` | `true` | Enable broken image detection |
| `data-form-frustration` | `true` | Enable form frustration detection |
| `data-popover` | `true` | Show feedback popovers when issues detected |
| `data-popover-theme` | `dark` | Popover theme: `dark` or `light` |
| `data-max-popups` | `5` | Max feedback popovers per session |
| `data-popover-cooldown` | `30000` | ms between popovers |
| `data-debug` | `false` | Log events to console |

## Project structure

```
reev/
├── app/
│   ├── (dashboard)/
│   │   ├── issues/          # Main issues feed
│   │   ├── feedback/        # User feedback from popovers
│   │   ├── sessions/        # Session list + detail
│   │   └── settings/        # Project config
│   ├── api/
│   │   ├── events/          # Tracker ingestion endpoint
│   │   ├── feedback/        # Feedback API
│   │   ├── insights/        # Issues API + summary + linked sessions
│   │   ├── sessions/        # Session list + detail + events + tags
│   │   ├── stats/           # Today's stats + trend data
│   │   └── pages/           # Page-level analytics
│   ├── components/
│   │   ├── issues/          # IssueCard, Sparkline, SeverityGroup
│   │   ├── sessions/        # SessionList, Filters, Search, Tags
│   │   ├── layout/          # Navbar, PageHeader, ProjectSwitcher
│   │   └── ui/              # Button, Badge, Modal, Toast, etc.
│   ├── hooks/               # React Query hooks for all data fetching
│   └── providers/           # Auth, Query, Project, Toast providers
├── lib/
│   ├── db.ts                # PostgreSQL connection pool
│   ├── schema.sql           # Database schema
│   ├── auth.ts              # NextAuth configuration
│   └── jobs/
│       └── calculate-metrics.ts  # Insight detection engine
├── tracker/
│   ├── index.ts             # Tracker source (includes UX detectors + popover UI)
│   └── build.ts             # esbuild config
├── public/
│   └── tracker.js           # Built tracker (~12KB)
└── types/
    └── api.ts               # Shared TypeScript interfaces
```
