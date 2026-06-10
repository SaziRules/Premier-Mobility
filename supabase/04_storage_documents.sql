-- ============================================================
-- STORAGE BUCKET: documents
-- Stores client-uploaded compliance documents from /dashboard.
-- Files are stored at path: {userId}/{DocumentName}.{ext}
-- Max file size: 5 MB. Allowed types: PDF, JPEG, JPG, PNG.
-- Run this entire file in one go in the Supabase SQL editor.
-- ============================================================

-- Create the bucket (skips if it already exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  5242880,
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload into their own folder ({userId}/...)
CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update (re-upload) their own documents
CREATE POLICY "Users can update their own documents"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can read their own documents
CREATE POLICY "Users can read their own documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin users can read all uploaded documents
CREATE POLICY "Admins can read all documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.email() IN (
      'yusuf@premiergrp.co.za',
      'movedigital031@gmail.com'
    )
  );
