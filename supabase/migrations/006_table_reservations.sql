-- Table Reservations
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS table_reservations (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  phone text not null,
  email text,
  reservation_date date not null,
  reservation_time time not null,
  party_size int not null check (party_size > 0),
  special_requests text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- RLS Policies
ALTER TABLE table_reservations ENABLE ROW LEVEL SECURITY;

-- Allow public to insert reservations
DROP POLICY IF EXISTS "public insert reservations" ON table_reservations;
CREATE POLICY "public insert reservations"
ON table_reservations FOR INSERT
WITH CHECK (true);

-- Allow authenticated admins full access
DROP POLICY IF EXISTS "admin full access reservations" ON table_reservations;
CREATE POLICY "admin full access reservations"
ON table_reservations FOR ALL
USING (auth.role() = 'authenticated');
