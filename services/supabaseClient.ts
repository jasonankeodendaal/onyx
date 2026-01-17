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
-- 1. RESET & CLEANUP (Optional - removing conflicts)
-- drop policy if exists "Public Read Sites" on sites;
-- drop policy if exists "Public Insert Sites" on sites;

-- 2. CREATE TABLES
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
  metadata jsonb
);

-- 3. ENABLE ROW LEVEL SECURITY
alter table sites enable row level security;
alter table events enable row level security;

-- 4. CREATE INDEXES
create index if not exists events_site_id_idx on events(site_id);
create index if not exists events_created_at_idx on events(created_at);
create index if not exists events_type_idx on events(type);

-- 5. REALTIME PUBLICATION
-- (Note: In Supabase Dashboard, you may also need to enable Replication on these tables)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'events') then
    alter publication supabase_realtime add table events;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'sites') then
    alter publication supabase_realtime add table sites;
  end if;
end;
$$;

-- 6. POLICIES & PERMISSIONS (CRITICAL FOR PUBLIC ACCESS)

-- Grant access to the anon key (public client)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Sites Policies
create policy "Allow Public Read Sites" on sites for select using (true);
create policy "Allow Public Insert Sites" on sites for insert with check (true);
create policy "Allow Public Update Sites" on sites for update using (true);

-- Events Policies
create policy "Allow Public Read Events" on events for select using (true);
create policy "Allow Public Insert Events" on events for insert with check (true);
`;