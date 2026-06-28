-- Migration: Add description column to gallery_images for video metadata
-- Run this in your Supabase Dashboard → SQL Editor

ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS description text;
