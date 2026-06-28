-- Migration: Add missing deleted_at to gallery_categories
ALTER TABLE gallery_categories ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- Notify PostgREST to reload the schema cache so the API immediately recognizes the new column
NOTIFY pgrst, 'reload schema';
