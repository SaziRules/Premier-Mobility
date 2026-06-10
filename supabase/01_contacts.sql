-- ============================================================
-- TABLE: contacts
-- Stores all contact form submissions:
--   - "callback" type → Request A Call Back (contact page)
--   - "branch" type   → Get In Touch (branch cards)
-- Run this entire file in one go in the Supabase SQL editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS contacts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  phone        TEXT,
  email        TEXT,
  message      TEXT,
  contact_type TEXT        DEFAULT 'general',
  branch       TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form (no auth required)
CREATE POLICY "Allow public insert on contacts"
  ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Only admin users can read submissions
CREATE POLICY "Allow admin read on contacts"
  ON contacts
  FOR SELECT
  USING (
    auth.email() IN (
      'yusuf@premiergrp.co.za',
      'movedigital031@gmail.com'
    )
  );
