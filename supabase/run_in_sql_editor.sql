-- ============================================================
-- PEGA ESTO EN: Supabase Dashboard > SQL Editor > New Query > Run
-- Agrega columnas locale + translation_group_id a todas las tablas
-- ============================================================

-- 1. Content tables: locale + translation_group_id
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS translation_group_id UUID;

ALTER TABLE packages ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS translation_group_id UUID;

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS translation_group_id UUID;

ALTER TABLE group_trips ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE group_trips ADD COLUMN IF NOT EXISTS translation_group_id UUID;

ALTER TABLE events ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE events ADD COLUMN IF NOT EXISTS translation_group_id UUID;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS translation_group_id UUID;

ALTER TABLE faq ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE faq ADD COLUMN IF NOT EXISTS translation_group_id UUID;

-- 2. site_settings: add locale, update PK to (key, locale)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_pkey;
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_key_locale_key;
ALTER TABLE site_settings ADD PRIMARY KEY (key, locale);

-- 3. quote_requests: preferred language
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS preferred_locale TEXT NOT NULL DEFAULT 'es';

-- DONE! Ahora corre el seed script desde Cursor.
SELECT 'Migration complete!' AS status;
