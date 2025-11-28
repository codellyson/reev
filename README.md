# Reev Simple Flow (No Heatmaps)

## The Entire App in 3 Steps

1. **Track**: JavaScript records user sessions on websites
2. **Store**: API saves events to PostgreSQL  
3. **Watch**: Dashboard plays back sessions

---

## USER FLOWS

### Setup Flow (Website Owner - Once)

```
1. Get tracking code
   → <script src="https://cdn.yourapp.com/tracker.js" data-project="abc123"></script>

2. Paste before </body> on website

3. Deploy

4. Dashboard shows "Receiving data ✓"
```

**Done. Takes 2 minutes.**

---

### Recording Flow (Automatic - End Users)

```
User visits website
  ↓
tracker.js loads (30KB, async)
  ↓
Generates sessionId = UUID
  ↓
rrweb starts recording:
  - Clicks
  - Scrolls  
  - Page changes
  - Form inputs (masked)
  - Errors
  ↓
Events batched in memory (array)
  ↓
Every 10 seconds: POST /events
  ↓
User leaves → Final batch sent
  ↓
Session complete
```

**User sees nothing. Zero impact.**

---

### Viewing Flow (Dashboard User)

```
Login to dashboard
  ↓
See session list:
  - Session ID | Duration | Page URL | Device | Time
  ↓
Click a session row
  ↓
Watch replay:
  - Video-like player
  - Timeline scrubbing
  - Speed controls (1x, 2x, 4x)
  - Event sidebar (clicks, errors, navigation)
  ↓
Identify issues → Fix website
```

---

## DATA FLOW

### What Gets Sent from Browser

```javascript
// Every 10 seconds
POST https://api.yourapp.com/events

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "projectId": "abc123",
  "events": [
    { "type": 2, "timestamp": 1234567890, "data": {...} }, // Full snapshot
    { "type": 3, "timestamp": 1234567900, "data": {...} }, // DOM change
    { "type": 6, "timestamp": 1234568000, "data": {...} }, // Click
    // ... up to 50 events
  ]
}
```

---

### What Server Does

```
1. Receive POST /events
   ↓
2. Validate projectId exists
   ↓
3. Database writes:

   // Upsert session
   INSERT INTO sessions (id, project_id, page_url, started_at)
   VALUES (...)
   ON CONFLICT (id) DO UPDATE SET last_event_at = NOW()

   // Insert events
   INSERT INTO events (session_id, event_type, data, timestamp)
   VALUES (...) 

   ↓
4. Return 204 No Content
   ↓
5. Background job (runs every 1 min):
   - Calculate session duration
   - Count total clicks
   - Count errors
   - Update sessions table
```

---

### What Dashboard Requests

```
// Session list
GET /api/sessions?page=1&limit=50
→ Returns:
{
  "sessions": [
    {
      "id": "550e8400...",
      "duration": 165,
      "pageUrl": "/checkout",
      "timestamp": "2025-01-15T10:30:00Z",
      "device": "mobile",
      "clicks": 12,
      "errors": 1
    }
  ],
  "total": 1234
}

// Session replay
GET /api/sessions/550e8400.../events
→ Returns:
{
  "events": [
    { "type": 2, "timestamp": 0, "data": {...} },
    { "type": 3, "timestamp": 150, "data": {...} },
    // ... all events for this session
  ]
}
```

---

## DATABASE SCHEMA (Minimal)

```sql
-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_event_at TIMESTAMPTZ,
  duration INTEGER, -- seconds, calculated by background job
  clicks INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0
);

CREATE INDEX idx_sessions_project ON sessions(project_id, started_at DESC);

-- Events table
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  event_type INTEGER, -- rrweb event types: 2=snapshot, 3=mutation, 6=click, etc.
  data JSONB, -- full event payload
  timestamp BIGINT, -- milliseconds since session start
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_session ON events(session_id, timestamp);
```

**That's it. Two tables.**

---

## PAGES (Minimal Dashboard)

### 1. Dashboard (/)

**What it shows:**
- Total sessions today
- Average session duration  
- Recent sessions (last 10)

**API calls:**
```javascript
GET /api/stats/today
GET /api/sessions?limit=10
```

**Components:**
- 2 StatsCards (total sessions, avg duration)
- SessionList table (just last 10 rows)

---

### 2. Sessions (/sessions)

**What it shows:**
- Full session list (paginated)
- Filters: Date range, Page URL, Device

**API calls:**
```javascript
GET /api/sessions?page=1&limit=50&dateRange=...&pageUrl=...&device=...
```

**Components:**
- FilterPanel (date picker, device checkboxes, URL search)
- SessionList table (full version with sorting)

**User actions:**
- Click row → Navigate to /session/:id
- Apply filters → Re-fetch with query params
- Sort by column → Re-fetch with sortBy param

---

### 3. Player (/session/:id)

**What it shows:**
- Video player showing user's session
- Timeline with scrubbing
- Event sidebar (clicks, errors, navigation)
- Playback controls

**API calls:**
```javascript
GET /api/sessions/:id
GET /api/sessions/:id/events
```

**Components:**
- PlayerFrame (rrweb-player showing replay)
- PlayerControls (play/pause, speed, timeline)
- EventTimeline (sidebar with clickable events)

**User actions:**
- Play/pause
- Change speed (0.5x, 1x, 2x, 4x)
- Scrub timeline → Jump to timestamp
- Click event in sidebar → Jump to that moment

---

## COMPONENT BREAKDOWN (Essential Only)

### Phase 1: Core UI (Day 1)
1. Button
2. LoadingSpinner
3. EmptyState
4. Badge

### Phase 2: Data Display (Day 2-3)
5. TopNavbar
6. SessionList (table)
7. StatsCard

### Phase 3: Filters (Day 4)
8. FilterPanel (date picker + checkboxes)
9. SearchBar

### Phase 4: Player (Day 5-6)
10. PlayerFrame (rrweb-player wrapper)
11. PlayerControls (timeline + buttons)
12. EventTimeline (sidebar)

**Total: 12 components**

---

## TECH STACK (Simplified)

### Frontend (Dashboard)
```
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router (routing)
- rrweb-player (session playback)
- date-fns (date handling)
- Lucide React (icons)
```

### Tracker (Client SDK)
```
- Vanilla JavaScript
- rrweb (recording library)
- Build with esbuild (minify to <30KB)
```

### Backend (API)
```
- Node.js + Express (or Fastify for speed)
- PostgreSQL (database)
- pg (Postgres client)
```

### Infrastructure
```
- Docker + Docker Compose (local dev)
- Single VPS for MVP (DigitalOcean $12/mo)
- CDN for tracker.js (Cloudflare free tier)
```

---

## FILE STRUCTURE

```
reev/
├── tracker/
│   ├── index.js           # Main tracker code
│   ├── build.js           # esbuild config
│   └── package.json
│
├── backend/
│   ├── server.js          # Express app
│   ├── db.js              # Postgres connection
│   ├── routes/
│   │   ├── events.js      # POST /events
│   │   ├── sessions.js    # GET /sessions, GET /sessions/:id
│   │   └── stats.js       # GET /stats/today
│   ├── jobs/
│   │   └── calculate-metrics.js  # Background job
│   └── package.json
│
├── dashboard/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Sessions.tsx
│   │   │   └── Player.tsx
│   │   ├── components/
│   │   │   ├── SessionList.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── EventTimeline.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── StatsCard.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   ├── useSessions.ts
│   │   │   └── useSessionEvents.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── docker-compose.yml
```

---

## MVP FEATURE LIST

### Must Have
✅ Track sessions (clicks, scrolls, navigation, errors)
✅ Store events in database
✅ List all sessions (with pagination)
✅ Watch session replay
✅ Basic filters (date range, page URL)
✅ Session metadata (duration, clicks, errors)

### Don't Need Yet
❌ Heatmaps
❌ User authentication (build as single-tenant first)
❌ Real-time updates
❌ Advanced analytics
❌ Team features
❌ Multiple projects (hardcode one project for MVP)
❌ Data retention policies
❌ Export functionality

---

## BUILD ORDER

### Week 1: Backend + Tracker
**Day 1-2**: Database + API
- Set up Postgres
- Create tables
- Build POST /events endpoint
- Build GET /sessions endpoints

**Day 3-4**: Tracker
- Build tracker.js with rrweb
- Test on simple HTML page
- Deploy to CDN

**Day 5**: Background jobs
- Calculate session metrics
- Test end-to-end flow

### Week 2: Dashboard
**Day 1-2**: Foundation
- Set up React + Vite
- Build core UI components
- Create routing

**Day 3-4**: Session list
- SessionList table
- FilterPanel
- API integration

**Day 5-6**: Player
- PlayerFrame with rrweb-player
- PlayerControls
- EventTimeline

**Day 7**: Polish
- Loading states
- Error handling
- Deploy

---


## SUMMARY

The app does **ONE THING WELL**: Record and replay user sessions.

- Website owner pastes script → Sessions recorded
- Analyst opens dashboard → Watches replays
- No heatmaps, no analytics, no fluff

**It's Loom for website behavior.**