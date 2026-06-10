-- ============================================================
-- TABLE: credit_applications
-- One application per user. Clients submit when all required
-- documents are uploaded. Portal admins review and update status.
--
-- Depends on: 05_portal_admins.sql (is_portal_admin function)
-- ============================================================

CREATE TABLE IF NOT EXISTS credit_applications (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL UNIQUE,
  email        TEXT        NOT NULL,
  company      TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  admin_note   TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ,
  reviewed_by  TEXT
);

ALTER TABLE credit_applications ENABLE ROW LEVEL SECURITY;

-- Users can read their own application
CREATE POLICY "Users can read own application"
  ON credit_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can submit once (INSERT, not UPDATE — re-submissions handled by the app)
CREATE POLICY "Users can insert own application"
  ON credit_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Portal admins can read all applications
CREATE POLICY "Portal admins can read all applications"
  ON credit_applications FOR SELECT
  USING (is_portal_admin());

-- Portal admins can update status
CREATE POLICY "Portal admins can update application status"
  ON credit_applications FOR UPDATE
  USING (is_portal_admin())
  WITH CHECK (is_portal_admin());
