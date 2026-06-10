-- ============================================================
-- TABLE: quote_requests
-- Quote/trip requests submitted via the SmartSearchBar.
-- Public INSERT so anyone (even unauthenticated) can request.
-- Portal admins review and respond via admin_note.
--
-- Depends on: 05_portal_admins.sql (is_portal_admin function)
-- ============================================================

CREATE TABLE IF NOT EXISTS quote_requests (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID,
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  phone        TEXT,
  origin       TEXT,
  destination  TEXT        NOT NULL,
  pickup_date  DATE        NOT NULL,
  cargo_type   TEXT        NOT NULL,
  cargo_notes  TEXT,
  status       TEXT        NOT NULL DEFAULT 'new'
                           CHECK (status IN ('new', 'reviewing', 'quoted', 'closed')),
  admin_note   TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ,
  reviewed_by  TEXT
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a quote request
CREATE POLICY "Public can submit quote requests"
  ON quote_requests FOR INSERT
  WITH CHECK (true);

-- Logged-in users can read their own requests
CREATE POLICY "Users can read own quote requests"
  ON quote_requests FOR SELECT
  USING (auth.uid() = user_id OR auth.email() = email);

-- Portal admins can read all requests
CREATE POLICY "Portal admins can read all quote requests"
  ON quote_requests FOR SELECT
  USING (is_portal_admin());

-- Portal admins can update status and respond
CREATE POLICY "Portal admins can update quote requests"
  ON quote_requests FOR UPDATE
  USING (is_portal_admin())
  WITH CHECK (is_portal_admin());
