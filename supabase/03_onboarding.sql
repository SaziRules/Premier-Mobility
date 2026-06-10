-- ============================================================
-- TABLE: onboarding
-- Stores client onboarding wizard submissions.
-- Created alongside an auth.users record (signUp flow).
-- Fields mirror the OnboardingWizard 4-step form.
-- Run this entire file in one go in the Supabase SQL editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS onboarding (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT,
  company    TEXT,
  address    TEXT,
  reg        TEXT,
  vat        TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;

-- Anyone can submit the onboarding form
-- (user may not be confirmed yet at insert time)
CREATE POLICY "Allow public insert on onboarding"
  ON onboarding
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can read their own record (used by /dashboard)
CREATE POLICY "Users can read their own onboarding record"
  ON onboarding
  FOR SELECT
  USING (email = auth.email());

-- Admin users can read all records (used by /admin portal)
CREATE POLICY "Allow admin read on onboarding"
  ON onboarding
  FOR SELECT
  USING (
    auth.email() IN (
      'yusuf@premiergrp.co.za',
      'movedigital031@gmail.com'
    )
  );
