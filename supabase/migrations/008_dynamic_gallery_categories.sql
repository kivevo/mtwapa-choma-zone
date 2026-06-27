-- Migration: Dynamic Gallery Categories
-- 1. Create the new dynamic categories table
CREATE TABLE IF NOT EXISTS gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 2. Insert the existing hardcoded categories so no data is orphaned
INSERT INTO gallery_categories (name, slug, display_order)
VALUES
  ('Garden', 'garden', 1),
  ('Food Choma', 'food_choma', 2),
  ('Kids Playground', 'kids_playground', 3),
  ('Choma Area', 'choma_area', 4),
  ('Coffee Shop', 'coffee_shop', 5),
  ('Parking', 'parking', 6),
  ('Signage', 'signage', 7),
  ('Bar Area', 'bar_area', 8),
  ('Events', 'events', 9),
  ('Website Assets', 'website_assets', 10)
ON CONFLICT (slug) DO NOTHING;

-- 3. Alter the gallery_images table to convert the ENUM to text
ALTER TABLE gallery_images 
  ALTER COLUMN category TYPE text USING category::text;

-- 4. Add a foreign key constraint linking to the new table
ALTER TABLE gallery_images 
  ADD CONSTRAINT fk_gallery_category 
  FOREIGN KEY (category) 
  REFERENCES gallery_categories(slug) 
  ON DELETE CASCADE;

-- 5. Drop the old enum type (optional but good for cleanup)
DROP TYPE IF EXISTS gallery_category;
