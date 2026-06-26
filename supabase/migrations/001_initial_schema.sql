-- Choma Zone Mtwapa Palms — initial schema
-- Run in Supabase SQL Editor or via Supabase CLI

-- ============================================
-- SITE SETTINGS
-- ============================================
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Choma Zone Mtwapa Palms',
  tagline text default 'Open Garden Hospitality',
  phone_primary text default '0711333090',
  phone_secondary text default '0722878481',
  email text default 'mtwapapalmsltd@gmail.com',
  address text default 'Mombasa-Malindi Highway, Mtwapa, opposite Galana Petrol Station',
  latitude numeric default -3.943549,
  longitude numeric default 39.745274,
  google_place_id text default 'ChIJH9J-1GcJQBgRsgp0tmZBpBY',
  instagram_url text default 'https://www.instagram.com/mtwapapalms',
  facebook_url text default 'https://www.facebook.com/ChomaZoneMtwapaPalm',
  tiktok_url text default 'https://www.tiktok.com/@chomazonemtwapa',
  opening_hours jsonb default '{"mon_fri": "10:00 - 23:00", "sat_sun": "08:00 - late"}'::jsonb,
  happy_hour_text text default 'Happy Hour daily 4PM - 7PM. Cold drinks, good vibes.',
  stat_years_open int default 8,
  stat_parking_capacity int default 100,
  stat_happy_customers text default 'Thousands',
  updated_at timestamptz default now()
);

-- ============================================
-- MENU
-- ============================================
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  display_order int default 0,
  is_signature boolean default false
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price_kes numeric,
  image_url text,
  is_available boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- GALLERY
-- ============================================
do $$ begin
  create type gallery_category as enum (
    'garden', 'food_choma', 'kids_playground', 'choma_area',
    'coffee_shop', 'parking', 'signage', 'bar_area', 'events'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  category gallery_category not null,
  storage_path text not null,
  caption text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- EVENT TYPES
-- ============================================
create table if not exists event_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_name text,
  image_url text,
  display_order int default 0
);

-- ============================================
-- EVENT INQUIRIES
-- ============================================
create table if not exists event_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  event_type_id uuid references event_types(id),
  preferred_date date,
  guest_count int,
  message text,
  status text default 'new' check (status in ('new','contacted','confirmed','completed','cancelled')),
  created_at timestamptz default now()
);

-- ============================================
-- CONTACT MESSAGES
-- ============================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- TESTIMONIALS
-- ============================================
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int check (rating between 1 and 5),
  comment text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- EVENTS CALENDAR
-- ============================================
create table if not exists events_calendar (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  day_of_week text,
  event_date date,
  is_recurring boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table site_settings enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table gallery_images enable row level security;
alter table event_types enable row level security;
alter table event_inquiries enable row level security;
alter table contact_messages enable row level security;
alter table testimonials enable row level security;
alter table events_calendar enable row level security;

drop policy if exists "public read settings" on site_settings;
drop policy if exists "public read menu categories" on menu_categories;
drop policy if exists "public read menu items" on menu_items;
drop policy if exists "public read gallery" on gallery_images;
drop policy if exists "public read event types" on event_types;
drop policy if exists "public read approved testimonials" on testimonials;
drop policy if exists "public read calendar" on events_calendar;
drop policy if exists "public can submit inquiry" on event_inquiries;
drop policy if exists "public can submit contact" on contact_messages;
drop policy if exists "admin full access settings" on site_settings;
drop policy if exists "admin full access menu categories" on menu_categories;
drop policy if exists "admin full access menu items" on menu_items;
drop policy if exists "admin full access gallery" on gallery_images;
drop policy if exists "admin full access event types" on event_types;
drop policy if exists "admin full access inquiries" on event_inquiries;
drop policy if exists "admin full access contact" on contact_messages;
drop policy if exists "admin full access testimonials" on testimonials;
drop policy if exists "admin full access calendar" on events_calendar;

create policy "public read settings" on site_settings for select using (true);
create policy "public read menu categories" on menu_categories for select using (true);
create policy "public read menu items" on menu_items for select using (is_available = true);
create policy "public read gallery" on gallery_images for select using (true);
create policy "public read event types" on event_types for select using (true);
create policy "public read approved testimonials" on testimonials for select using (approved = true);
create policy "public read calendar" on events_calendar for select using (true);

create policy "public can submit inquiry" on event_inquiries for insert with check (true);
create policy "public can submit contact" on contact_messages for insert with check (true);

create policy "admin full access settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "admin full access menu categories" on menu_categories for all using (auth.role() = 'authenticated');
create policy "admin full access menu items" on menu_items for all using (auth.role() = 'authenticated');
create policy "admin full access gallery" on gallery_images for all using (auth.role() = 'authenticated');
create policy "admin full access event types" on event_types for all using (auth.role() = 'authenticated');
create policy "admin full access inquiries" on event_inquiries for all using (auth.role() = 'authenticated');
create policy "admin full access contact" on contact_messages for all using (auth.role() = 'authenticated');
create policy "admin full access testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "admin full access calendar" on events_calendar for all using (auth.role() = 'authenticated');
