-- ============================================
-- Creatly Planner: Client/Brand System Migration
-- ============================================

-- 1. Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text DEFAULT '',
  contact_email text DEFAULT '',
  industry text DEFAULT '',
  brand_context jsonb DEFAULT '{}'::jsonb,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Add client_id column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES clients(id) ON DELETE SET NULL;

-- 3. Enable RLS with open policies (matching existing pattern)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to clients" ON clients
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable realtime for clients
ALTER PUBLICATION supabase_realtime ADD TABLE clients;

-- 5. Create index for faster project lookups by client
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
