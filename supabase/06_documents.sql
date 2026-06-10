-- ============================================================
-- TABLE: documents
-- Tracks every file a client uploads. One row per document
-- type per user (UNIQUE on user_id + doc_name). Re-uploading
-- upserts the row and resets status back to 'pending'.
--
-- Depends on: 05_portal_admins.sql (is_portal_admin function)
-- Run AFTER 05_portal_admins.sql.
-- ============================================================

-- Add user_id to onboarding table (backfills as NULL for old rows)
ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS user_id UUID;

CREATE TABLE IF NOT EXISTS documents (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL,
  email        TEXT        NOT NULL,
  doc_name     TEXT        NOT NULL,
  storage_path TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note   TEXT,
  uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ,
  reviewed_by  TEXT,
  UNIQUE (user_id, doc_name)
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users can read their own document records
CREATE POLICY "Users can read own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own document records
CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update (re-upload resets status)
CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Portal admins can read all document records
CREATE POLICY "Portal admins can read all documents"
  ON documents FOR SELECT
  USING (is_portal_admin());

-- Portal admins can update status / add review notes
CREATE POLICY "Portal admins can update document status"
  ON documents FOR UPDATE
  USING (is_portal_admin())
  WITH CHECK (is_portal_admin());

-- ── Storage policy update ────────────────────────────────────
-- Allow portal admins to read uploaded files in storage
-- (replaces the hardcoded-email approach from 04_storage_documents.sql)
DROP POLICY IF EXISTS "Admins can read all documents" ON storage.objects;

CREATE POLICY "Portal admins can read all storage documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.portal_admins WHERE email = auth.email()
    )
  );

-- ── Onboarding RLS update ────────────────────────────────────
-- Drop the hardcoded-email policy and replace with portal_admins check
DROP POLICY IF EXISTS "Allow admin read on onboarding" ON onboarding;

CREATE POLICY "Portal admins can read all onboarding"
  ON onboarding FOR SELECT
  USING (is_portal_admin());
