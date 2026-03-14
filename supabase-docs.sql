-- Docs table for knowledge base
create table if not exists docs (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled',
  content text default '',
  folder text default 'General',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable realtime
alter publication supabase_realtime add table docs;

-- Enable RLS with open access
alter table docs enable row level security;
create policy "Allow all on docs" on docs for all using (true) with check (true);
