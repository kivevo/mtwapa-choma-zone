-- Migration: Video Support in Gallery
-- Add media_type column to gallery_images to distinguish between image and video

ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';
-- the media_type will be either 'image' or 'video'
