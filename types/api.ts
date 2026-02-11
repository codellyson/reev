export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Session {
  id: string;
  projectId: string;
  duration: number;
  pageUrl: string;
  timestamp: Date | string;
  device: "desktop" | "mobile" | "tablet";
  userAgent: string;
  clicks: number;
  errors?: number;
  startedAt: Date | string;
  lastEventAt: Date | string;
}

export interface PageEvent {
  id: string;
  sessionId: string;
  eventType: string;
  url: string | null;
  data: Record<string, any>;
  timestamp: number;
}

export interface Stats {
  totalPageviews: number;
  uniqueSessions: number;
  avgScrollDepth: number;
  errorCount: number;
  topPages: Array<{
    url: string;
    count: number;
  }>;
}

export interface TrendData {
  dates: string[];
  pageviews: number[];
  sessions: number[];
  errors: number[];
}

export interface Insight {
  id: string;
  projectId: string;
  type: InsightType;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string | null;
  url: string | null;
  metricValue: number | null;
  metadata: Record<string, any>;
  firstSeenAt: string;
  lastSeenAt: string;
  occurrences: number;
  status: "active" | "acknowledged" | "resolved";
}

export type InsightType =
  | "rage_click"
  | "scroll_dropoff"
  | "form_abandonment"
  | "slow_page"
  | "error_spike";

export interface PageStat {
  url: string;
  date: string;
  views: number;
  uniqueSessions: number;
  avgScrollDepth: number;
  avgTimeOnPage: number;
  bounceCount: number;
  rageClickCount: number;
  errorCount: number;
  avgLcp: number | null;
  avgFid: number | null;
  avgCls: number | null;
}

export interface SessionQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  dateRange?: {
    start: string;
    end: string;
  };
  devices?: string[];
  pageUrl?: string;
  minDuration?: number;
  maxDuration?: number;
  hasErrors?: boolean;
}
