-- ============================================================
-- TABLE: newsletter
-- Stores email addresses from the footer subscribe form.
-- Email column is UNIQUE to prevent duplicate subscriptions.
-- Run this entire file in one go in the Supabase SQL editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS newsletter (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (no auth required)
CREATE POLICY "Allow public insert on newsletter"
  ON newsletter
  FOR INSERT
  WITH CHECK (true);

-- Only admin users can read the subscriber list
CREATE POLICY "Allow admin read on newsletter"
  ON newsletter
  FOR SELECT
  USING (
    auth.email() IN (
      'yusuf@premiergrp.co.za',
      'movedigital031@gmail.com'
    )
  );
