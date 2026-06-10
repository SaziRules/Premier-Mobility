-- ============================================================
-- TABLE: portal_admins
-- Database-managed list of users who can access /portal.
-- Access is checked against this table, not hardcoded emails.
-- Run this entire file in one go in the Supabase SQL editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS portal_admins (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        UNIQUE NOT NULL,
  name       TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE portal_admins ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER function avoids self-referential RLS recursion
CREATE OR REPLACE FUNCTION is_portal_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM portal_admins WHERE email = auth.email()
  );
$$;

-- Only portal admins can read the full list
CREATE POLICY "Portal admins can read portal_admins"
  ON portal_admins
  FOR SELECT
  USING (is_portal_admin());

-- Seed the first admin
INSERT INTO portal_admins (email, name, created_by)
VALUES ('sazi@thepitchdot.co.za', 'Sazi', 'system')
ON CONFLICT (email) DO NOTHING;
