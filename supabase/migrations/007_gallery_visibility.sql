-- Add is_visible column to gallery_images to support hiding images from the public gallery
-- Run this in your Supabase SQL Editor

ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;

-- Also ensure website_assets category exists (it's stored as text, not the enum)
-- The public gallery will filter: is_visible = true AND category != 'website_assets'
