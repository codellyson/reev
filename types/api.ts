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

export type ReportIssueType =
  | "rage_click"
  | "dead_link"
  | "broken_image"
  | "form_frustration";

export interface Report {
  id: number;
  session_id: string;
  project_id: string;
  issue_type: ReportIssueType;
  issue_severity: string | null;
  issue_selector: string | null;
  message: string | null;
  page_url: string | null;
  device: string | null;
  browser: string | null;
  status: "open" | "resolved";
  created_at: string;
  user_agent: string | null;
  context?: {
    timeOnPage?: number | null;
    domSnapshot?: string | null;
    consoleErrors?: Array<{ message: string; source?: string; line?: number; timestamp: number }>;
    breadcrumbs?: Array<{ action: string; target?: string; url?: string; timestamp: number }>;
  };
}

export interface Pattern {
  id: number;
  project_id: string;
  issue_type: string;
  page_url_pattern: string | null;
  selector_pattern: string | null;
  title: string;
  report_count: number;
  first_seen_at: string;
  last_seen_at: string;
  status: "open" | "resolved";
  recent_messages: string[];
}

export interface FlowSuggestion {
  id: number;
  project_id: string;
  source_url_pattern: string;
  target_url: string;
  target_label: string;
  source: "manual" | "auto" | "sitemap";
  priority: number;
  click_count: number;
  dismiss_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlowConfig {
  id?: number;
  project_id?: string;
  enabled: boolean;
  display_mode: "frustration" | "always";
  max_suggestions: number;
  widget_position: string;
  widget_theme: string;
  auto_discover: boolean;
  min_transition_count: number;
}

export interface SitemapTreeNode {
  path: string;
  segment: string;
  label: string;
  children: SitemapTreeNode[];
  isPage: boolean;
}

export interface SitemapData {
  tree: SitemapTreeNode;
  totalUrls: number;
  truncated: boolean;
  fetchedAt: string;
  sitemapUrl: string;
}
