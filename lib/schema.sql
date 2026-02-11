CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_url TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_event_at TIMESTAMPTZ,
  duration INTEGER,
  clicks INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id, started_at DESC);

-- Lightweight behavioral events (replaces old rrweb events table)
CREATE TABLE IF NOT EXISTS page_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  url TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_events_session ON page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_page_events_type ON page_events(event_type);
CREATE INDEX IF NOT EXISTS idx_page_events_url ON page_events(url);
CREATE INDEX IF NOT EXISTS idx_page_events_created ON page_events(created_at);

-- Aggregated insights (computed by background job)
CREATE TABLE IF NOT EXISTS insights (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  metric_value NUMERIC,
  metadata JSONB DEFAULT '{}',
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  occurrences INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insights_project ON insights(project_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(type);
CREATE INDEX IF NOT EXISTS idx_insights_severity ON insights(severity);
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);

-- Page-level daily aggregations
CREATE TABLE IF NOT EXISTS page_stats (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  avg_scroll_depth NUMERIC DEFAULT 0,
  avg_time_on_page NUMERIC DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  rage_click_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  avg_lcp NUMERIC,
  avg_fid NUMERIC,
  avg_cls NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, url, date)
);

CREATE INDEX IF NOT EXISTS idx_page_stats_project_date ON page_stats(project_id, date);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, project_id)
);

CREATE INDEX IF NOT EXISTS idx_tags_project ON tags(project_id);

CREATE TABLE IF NOT EXISTS session_tags (
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (session_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_session_tags_session ON session_tags(session_id);
CREATE INDEX IF NOT EXISTS idx_session_tags_tag ON session_tags(tag_id);
