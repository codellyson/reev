# Reev

UX is hard. Reev makes it simple.

Reev is a lightweight, open-source UX frustration detector with real-time feedback collection. Install a script on your site, and Reev catches frustration as it happens - rage clicks, dead links, broken images, form frustration. When issues occur, users can provide instant feedback via inline popovers. The dashboard groups repeated feedback into patterns so you can fix problems fast.

## How it works

```
1. Install   → Paste a <script> tag on your site
2. Detect    → Reev watches for rage clicks, dead links, broken images, and form frustration
3. Collect   → Users submit feedback when issues are detected (optional inline popovers)
4. Fix       → Reports and patterns tell you what's wrong, what users said, and where
```

## What Reev detects

| Issue | How it works | Severity |
| --- | --- | --- |
| **Rage clicks** | 3+ clicks on the same element within 1.5 seconds | Medium |
| **Dead links** | Same-origin links that return errors or timeout | Medium |
| **Broken images** | Images that fail to load (scans existing + watches new) | Low |
| **Form frustration** | 2+ clear-and-retype cycles on the same field within 30s | Medium |

Each issue triggers an inline feedback popover where users can describe what went wrong. Their feedback is stored with full context - browser, device, selector, and recent errors.

## Flow Suggestions

Beyond detection, Reev includes a flow suggestions system that helps guide users to the right page:

- **Manual flows** - define navigation suggestions for specific pages
- **Auto-discovery** - detect common page transitions from pageview data
- **Sitemap import** - bulk-create suggestions from your sitemap.xml
- **Configurable widget** - display on frustration or always, with customizable position and theme

## Pages

| Route       | Purpose                                                              |
| ----------- | -------------------------------------------------------------------- |
| `/reports`  | All frustration reports, filterable by status, issue type, and URL   |
| `/patterns` | Recurring issues (2+ reports on same page/issue type) with messages  |
| `/flows`    | Manage flow suggestions - manual, auto-discovered, or sitemap-based  |
| `/settings` | Project config, tracker setup code with framework snippets           |

## Tech stack

- **Frontend**: Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS, TanStack Query, Framer Motion
- **Database**: PostgreSQL (Neon-compatible)
- **Auth**: NextAuth with credentials provider
- **Tracker**: Vanilla TypeScript, ~7KB minified, zero dependencies
- **Build**: esbuild (tracker), Next.js (dashboard)

## Data flow

```text
Browser (reev.js tracker)
  ↓ sends pageview + ux_feedback events
POST /api/events
  ↓ validates project, stores events, saves feedback
PostgreSQL (page_events + feedback tables)
  ↓ auto-groups on ingestion (2+ reports = pattern)
Patterns (GET /api/patterns)
  ↓
Reports feed (GET /api/reports)
```

## Events sent to API

The tracker sends these event types to the server:

- `pageview` - URL, referrer, title, viewport
- `ux_feedback` - user feedback submitted via popover (with browser, device, selector, context)
- `suggestion_clicked` - user clicked a flow suggestion
- `suggestion_dismissed` - user dismissed the suggestions widget

Other events (clicks, scrolls, errors, vitals) are tracked locally for context capture but not sent to the API.

## Database

```sql
users            - auth
projects         - multi-project support
sessions         - one row per visitor session
page_events      - all tracked events (type, url, JSONB data, timestamp)
feedback         - user feedback from popover submissions (issue_type, severity, message, context)
patterns         - recurring issues (issue_type + page_url with 2+ reports)
flow_suggestions - navigation suggestions (manual, auto, sitemap)
flow_config      - per-project flow widget settings
page_stats       - daily page-level aggregations
tags             - session labeling
```

## Setup

```bash
# Clone and install
git clone https://github.com/codellyson/reev.git
cd reev
pnpm install

# Configure environment
cp .env.example .env  # fill in your DB credentials

# Run database migration
pnpm migrate

# Build tracker + start dev server
pnpm build
pnpm dev
```

Add the tracker to any site:

```html
<script>
!function(c, s) {
  window.ReevConfig = c;
  s = document.createElement("script");
  s.src = "https://your-reev-instance.com/reev.js";
  document.head.appendChild(s);
}({
  projectId: "your-project-id",
  apiUrl: "https://your-reev-instance.com"
})
</script>
```

Or install via npm:

```bash
npm install reev.js
```

### Tracker configuration

All features are enabled by default. Configure via `window.ReevConfig`:

```javascript
window.ReevConfig = {
  projectId: "your-project-id",
  apiUrl: "https://your-reev-instance.com",
  rageClick: true,          // rage click detection
  deadLink: true,           // dead link probing (same-origin only)
  brokenImage: true,        // broken image detection
  formFrustration: true,    // form clear-and-retype detection
  popover: true,            // show feedback popovers on issues
  popoverTheme: "dark",     // "dark" or "light"
  maxPopupsPerSession: 5,   // max popovers shown per session
  popoverCooldown: 30000,   // ms between popovers
  suggestions: false,       // flow suggestions widget (disabled by default)
  debug: false              // log events to console
};
```

| Option | Default | Description |
| --- | --- | --- |
| `rageClick` | `true` | Enable rage click detection |
| `deadLink` | `true` | Enable dead link detection |
| `brokenImage` | `true` | Enable broken image detection |
| `formFrustration` | `true` | Enable form frustration detection |
| `popover` | `true` | Show feedback popovers when issues detected |
| `popoverTheme` | `dark` | Popover theme: `dark` or `light` |
| `maxPopupsPerSession` | `5` | Max feedback popovers per session |
| `popoverCooldown` | `30000` | ms between popovers |
| `suggestions` | `false` | Enable flow suggestions widget |
| `debug` | `false` | Log events to console |

## Project structure

```text
reev/
├── app/
│   ├── (dashboard)/
│   │   ├── reports/         # Frustration reports feed
│   │   ├── patterns/        # Recurring issue patterns
│   │   ├── flows/           # Flow suggestions management
│   │   └── settings/        # Project config + tracker setup
│   ├── api/
│   │   ├── events/          # Tracker ingestion endpoint
│   │   ├── reports/         # Reports API (list, filter, resolve)
│   │   ├── patterns/        # Patterns API (list, compute, resolve)
│   │   ├── flows/           # Flow suggestions + config + discovery
│   │   └── projects/        # Project CRUD
│   ├── components/
│   │   ├── layout/          # Navbar, PageHeader, ProjectSwitcher
│   │   └── ui/              # Button, Badge, Modal, Toast, etc.
│   ├── hooks/               # React Query hooks for all data fetching
│   ├── providers/           # Auth, Query, Project, Toast providers
│   ├── docs/                # Documentation pages
│   ├── login/               # Login page
│   ├── signup/              # Sign up page
│   └── setup/               # Initial project setup + framework snippets
├── lib/
│   ├── db.ts                # PostgreSQL connection pool
│   ├── schema.sql           # Database schema
│   └── auth.ts              # NextAuth configuration
├── reevjs/
│   ├── index.ts             # reev.js source (UX detectors + popover UI)
│   ├── build.ts             # esbuild config
│   └── dist/                # npm-publishable output
├── public/
│   └── reev.js              # Built tracker (~7KB)
└── types/
    └── api.ts               # Shared TypeScript interfaces
```

---

## Future directions

1. **Critical Path Monitoring**: Allow users to define "critical paths" through their app (e.g. onboarding flow, checkout process). Reev would then specifically track UX issues along these paths and prioritize them in the feed.
2. **Custom Issue Types**: Let users define custom UX issue types based on their unique app and user behavior. For example, if a SaaS product has a unique "Create Project" flow, they could define an issue type for "Project Creation Frustration" that looks for specific signals in that flow.
3. **User Journey Mapping**: Provide a visual user journey map that shows where users drop off or encounter issues across the entire app, with the ability to drill down into specific paths or pages.
4. **Integrations**: Integrate with popular tools like Slack, Jira, or email to send real-time alerts when critical UX issues are detected on important pages.
