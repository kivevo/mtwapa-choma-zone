-- Setup Supabase Storage for image uploads
-- Run this in your Supabase SQL Editor

-- 1. Add 'website_assets' as a valid gallery category
-- (This category is hidden from the public gallery on the website)
ALTER TYPE gallery_category ADD VALUE IF NOT EXISTS 'website_assets';

-- 2. Create the storage bucket for gallery & asset images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Allow anyone to READ images in the bucket (public CDN access)
DROP POLICY IF EXISTS "public read gallery storage" ON storage.objects;
CREATE POLICY "public read gallery storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- 4. Allow authenticated admins to UPLOAD images
DROP POLICY IF EXISTS "admin upload gallery storage" ON storage.objects;
CREATE POLICY "admin upload gallery storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- 5. Allow authenticated admins to DELETE images
DROP POLICY IF EXISTS "admin delete gallery storage" ON storage.objects;
CREATE POLICY "admin delete gallery storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- 6. Allow authenticated admins to UPDATE image metadata
DROP POLICY IF EXISTS "admin update gallery storage" ON storage.objects;
CREATE POLICY "admin update gallery storage"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
