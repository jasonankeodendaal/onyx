import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORE_KEY = 'onyx_supabase_config';

export const getStoredConfig = (): { url: string; key: string } | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORE_KEY);
  try {
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Failed to parse config", e);
    return null;
  }
};

export const saveConfig = (url: string, key: string) => {
  localStorage.setItem(STORE_KEY, JSON.stringify({ url: url.trim(), key: key.trim() }));
  window.location.reload();
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const config = getStoredConfig();
  if (config && config.url && config.key) {
    try {
      // Validate URL syntax before attempting creation to prevent crashes
      new URL(config.url); 
      supabaseInstance = createClient(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: 'public',
        }
      });
      return supabaseInstance;
    } catch (e) {
      console.error("Invalid Supabase Config or URL", e);
      return null;
    }
  }
  return null;
};

// ==============================================================================
// ONYX MONITOR SYSTEM SETUP SQL
// ==============================================================================
export const SETUP_SQL = `
-- ==============================================================================
-- 1. SETUP TABLES
-- ==============================================================================

create table if not exists sites (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  url text not null,
  status text default 'online',
  health_score integer default 100
);

create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  site_id uuid references sites(id) on delete cascade,
  type text not null,
  path text,
  country text default 'Unknown',
  region text,
  city text,
  device text,
  os text,
  browser text,
  load_time_ms integer,
  session_id text,
  referrer text,
  metadata jsonb -- Changed to JSONB for better error querying
);

-- ==============================================================================
-- 2. CREATE INDEXES
-- ==============================================================================

create index if not exists events_site_id_idx on events(site_id);
create index if not exists events_created_at_idx on events(created_at);
create index if not exists events_type_idx on events(type);

-- ==============================================================================
-- 3. CONFIGURE REALTIME
-- ==============================================================================

-- Enable replication for specific tables to support real-time dashboards
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table sites;

-- ==============================================================================
-- 4. SECURITY POLICIES (RLS)
-- ==============================================================================

alter table sites enable row level security;
alter table events enable row level security;

-- Allow anonymous access (Adjust these if you require strict auth)
create policy "Public Read Sites" on sites for select using (true);
create policy "Public Insert Sites" on sites for insert with check (true);
create policy "Public Update Sites" on sites for update using (true);

create policy "Public Read Events" on events for select using (true);
create policy "Public Insert Events" on events for insert with check (true);
`;