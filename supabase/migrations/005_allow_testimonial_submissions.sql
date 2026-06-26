-- Allow public submissions of testimonials
-- Run this in your Supabase SQL Editor

-- 1. Enable public insert access for testimonials
DROP POLICY IF EXISTS "public insert testimonials" ON testimonials;
CREATE POLICY "public insert testimonials"
ON testimonials FOR INSERT
WITH CHECK (true);
