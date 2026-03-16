-- ============================================================
-- Migration: Add translation_group_id to all content tables
-- Run this in the Supabase Dashboard SQL Editor
-- ============================================================

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE packages ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE group_trips ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE events ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE faq ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
