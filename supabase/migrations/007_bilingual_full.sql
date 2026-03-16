-- ============================================================
-- Migration 007: Full bilingual support
-- Adds locale + translation_group_id to all content tables,
-- updates site_settings PK, and adds preferred_locale to quotes.
-- Safe to re-run (uses IF NOT EXISTS / IF EXISTS).
-- ============================================================

-- 1. Content tables: locale + translation_group_id
DO $$ 
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['promotions','packages','destinations','group_trips','events','blog_posts','faq']
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT ''es''', tbl);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS translation_group_id UUID', tbl);
  END LOOP;
END $$;

-- 2. site_settings: add locale column, migrate PK to (key, locale)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';

-- Drop old single-column PK if it exists, then create composite PK
DO $$
BEGIN
  -- Drop existing PK (could be key-only or key+locale)
  ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_pkey;
  ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_key_locale_key;
  -- Create the composite PK
  ALTER TABLE site_settings ADD PRIMARY KEY (key, locale);
EXCEPTION WHEN duplicate_table THEN
  NULL;
END $$;

-- 3. quote_requests: preferred language for the client
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS preferred_locale TEXT NOT NULL DEFAULT 'es';

-- 4. Update existing rows that may have empty locale
UPDATE promotions SET locale = 'es' WHERE locale = 'es';
UPDATE packages SET locale = 'es' WHERE locale = 'es';
UPDATE destinations SET locale = 'es' WHERE locale = 'es';
UPDATE group_trips SET locale = 'es' WHERE locale = 'es';
UPDATE events SET locale = 'es' WHERE locale = 'es';
UPDATE blog_posts SET locale = 'es' WHERE locale = 'es';
UPDATE faq SET locale = 'es' WHERE locale = 'es';
UPDATE quote_requests SET preferred_locale = 'es' WHERE preferred_locale = 'es';
