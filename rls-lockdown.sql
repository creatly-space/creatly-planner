-- ─────────────────────────────────────────────────────────────────────────────
-- CREATLY PLANNER: RLS LOCKDOWN
-- Replaces open access with "authenticated-only" across all tables.
-- Run this AFTER creating the two users in Supabase Auth:
--   ludvig@creatly.se  and  johannes@creatly.se
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: drop all existing policies on a table
-- (policy names vary — we blanket-drop the common ones)

-- ── projects ──
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for all users" ON projects;
DROP POLICY IF EXISTS "Enable update for all users" ON projects;
DROP POLICY IF EXISTS "Enable delete for all users" ON projects;
DROP POLICY IF EXISTS "open_access" ON projects;
DROP POLICY IF EXISTS "Allow all" ON projects;
DROP POLICY IF EXISTS "authenticated_access" ON projects;
CREATE POLICY "authenticated_access" ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── tag_colors ──
ALTER TABLE tag_colors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON tag_colors;
DROP POLICY IF EXISTS "Enable insert for all users" ON tag_colors;
DROP POLICY IF EXISTS "Enable update for all users" ON tag_colors;
DROP POLICY IF EXISTS "Enable delete for all users" ON tag_colors;
DROP POLICY IF EXISTS "open_access" ON tag_colors;
DROP POLICY IF EXISTS "Allow all" ON tag_colors;
DROP POLICY IF EXISTS "authenticated_access" ON tag_colors;
CREATE POLICY "authenticated_access" ON tag_colors FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── app_settings ──
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON app_settings;
DROP POLICY IF EXISTS "Enable insert for all users" ON app_settings;
DROP POLICY IF EXISTS "Enable update for all users" ON app_settings;
DROP POLICY IF EXISTS "Enable delete for all users" ON app_settings;
DROP POLICY IF EXISTS "open_access" ON app_settings;
DROP POLICY IF EXISTS "Allow all" ON app_settings;
DROP POLICY IF EXISTS "authenticated_access" ON app_settings;
CREATE POLICY "authenticated_access" ON app_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── docs ──
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON docs;
DROP POLICY IF EXISTS "Enable insert for all users" ON docs;
DROP POLICY IF EXISTS "Enable update for all users" ON docs;
DROP POLICY IF EXISTS "Enable delete for all users" ON docs;
DROP POLICY IF EXISTS "open_access" ON docs;
DROP POLICY IF EXISTS "Allow all" ON docs;
DROP POLICY IF EXISTS "authenticated_access" ON docs;
CREATE POLICY "authenticated_access" ON docs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── todos ──
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON todos;
DROP POLICY IF EXISTS "Enable insert for all users" ON todos;
DROP POLICY IF EXISTS "Enable update for all users" ON todos;
DROP POLICY IF EXISTS "Enable delete for all users" ON todos;
DROP POLICY IF EXISTS "open_access" ON todos;
DROP POLICY IF EXISTS "Allow all" ON todos;
DROP POLICY IF EXISTS "authenticated_access" ON todos;
CREATE POLICY "authenticated_access" ON todos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── clients ──
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON clients;
DROP POLICY IF EXISTS "Enable insert for all users" ON clients;
DROP POLICY IF EXISTS "Enable update for all users" ON clients;
DROP POLICY IF EXISTS "Enable delete for all users" ON clients;
DROP POLICY IF EXISTS "open_access" ON clients;
DROP POLICY IF EXISTS "Allow all" ON clients;
DROP POLICY IF EXISTS "authenticated_access" ON clients;
CREATE POLICY "authenticated_access" ON clients FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── notifications ──
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON notifications;
DROP POLICY IF EXISTS "Enable insert for all users" ON notifications;
DROP POLICY IF EXISTS "Enable update for all users" ON notifications;
DROP POLICY IF EXISTS "Enable delete for all users" ON notifications;
DROP POLICY IF EXISTS "open_access" ON notifications;
DROP POLICY IF EXISTS "Allow all" ON notifications;
DROP POLICY IF EXISTS "authenticated_access" ON notifications;
CREATE POLICY "authenticated_access" ON notifications FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── services ──
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON services;
DROP POLICY IF EXISTS "Enable insert for all users" ON services;
DROP POLICY IF EXISTS "Enable update for all users" ON services;
DROP POLICY IF EXISTS "Enable delete for all users" ON services;
DROP POLICY IF EXISTS "open_access" ON services;
DROP POLICY IF EXISTS "Allow all" ON services;
DROP POLICY IF EXISTS "authenticated_access" ON services;
CREATE POLICY "authenticated_access" ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── quotes ──
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON quotes;
DROP POLICY IF EXISTS "Enable insert for all users" ON quotes;
DROP POLICY IF EXISTS "Enable update for all users" ON quotes;
DROP POLICY IF EXISTS "Enable delete for all users" ON quotes;
DROP POLICY IF EXISTS "open_access" ON quotes;
DROP POLICY IF EXISTS "Allow all" ON quotes;
DROP POLICY IF EXISTS "authenticated_access" ON quotes;
CREATE POLICY "authenticated_access" ON quotes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── ideas ──
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON ideas;
DROP POLICY IF EXISTS "Enable insert for all users" ON ideas;
DROP POLICY IF EXISTS "Enable update for all users" ON ideas;
DROP POLICY IF EXISTS "Enable delete for all users" ON ideas;
DROP POLICY IF EXISTS "open_access" ON ideas;
DROP POLICY IF EXISTS "Allow all" ON ideas;
DROP POLICY IF EXISTS "authenticated_access" ON ideas;
CREATE POLICY "authenticated_access" ON ideas FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification: list all policies (should show "authenticated_access" on each)
-- ─────────────────────────────────────────────────────────────────────────────
SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
