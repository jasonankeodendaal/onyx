export interface Site {
  id: string;
  name: string;
  url: string;
  created_at: string;
  status: 'online' | 'offline' | 'degraded';
  last_checked: string;
  health_score: number;
}

export interface AnalyticsEvent {
  id: string;
  site_id: string;
  type: 'pageview' | 'click' | 'error' | 'vitals' | 'session_start' | 'network_fail';
  path: string;
  country: string;
  region?: string;
  city?: string;
  device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown';
  os?: string;
  browser?: string;
  referrer?: string;
  load_time_ms?: number;
  metadata?: string; // Stored as JSON string in DB
  created_at: string;
  session_id?: string;
}

export interface ErrorMetadata {
  message: string;
  stack?: string;
  componentStack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
}

export interface HeuristicSolution {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'critical';
  code_fix?: string;
}

// Derived aggregations for UI
export interface SiteStats {
  activeUsers: number;
  totalViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  errorRate: number;
  avgLoadTime: number;
}

export interface DailyTraffic {
  date: string;
  visits: number;
  errors: number;
}

// Supabase Configuration Helper Types
export interface SupabaseConfig {
  url: string;
  key: string;
}