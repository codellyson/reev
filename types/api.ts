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

export interface SessionEvent {
  id: string;
  sessionId: string;
  eventType: number;
  data: Record<string, any>;
  timestamp: number;
}

export interface Stats {
  totalSessions: number;
  avgDuration: number;
  bounceRate: number;
  errorCount: number;
  topPages: Array<{
    url: string;
    count: number;
  }>;
}

export interface TrendData {
  dates: string[];
  sessionCounts: number[];
}

export interface HeatmapDataPoint {
  x: number;
  y: number;
  count: number;
  intensity: number;
}

export interface HeatmapData {
  url: string;
  type: "click" | "scroll" | "attention";
  points: HeatmapDataPoint[];
}

export interface Page {
  url: string;
  sessionCount: number;
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

