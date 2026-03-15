-- Expand feature flags: add new module toggles and update labels
-- Safe to re-run (uses ON CONFLICT DO NOTHING for inserts, separate updates)

-- -----------------------------------------------------------------------
-- Update existing labels to Spanish-friendly names
-- -----------------------------------------------------------------------

UPDATE site_settings SET label = 'Tours y Excursiones'  WHERE key = 'feature_tours' AND locale = 'es';
UPDATE site_settings SET label = 'Renta de Autos'       WHERE key = 'feature_autos' AND locale = 'es';

-- -----------------------------------------------------------------------
-- New feature flags (Spanish)
-- -----------------------------------------------------------------------

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('feature_blog',          'true',  'feature_flags', 'Blog',                         'toggle', 'es'),
  ('feature_grupos',        'true',  'feature_flags', 'Viajes Grupales',              'toggle', 'es'),
  ('feature_eventos',       'true',  'feature_flags', 'Eventos Especiales',           'toggle', 'es'),
  ('feature_hoteles',       'true',  'feature_flags', 'Buscador de Hoteles',          'toggle', 'es'),
  ('feature_newsletter',    'true',  'feature_flags', 'Sección Newsletter (Home)',     'toggle', 'es'),
  ('feature_testimonials',  'true',  'feature_flags', 'Sección Testimonios (Home)',    'toggle', 'es'),
  ('feature_faq',           'true',  'feature_flags', 'Sección FAQ (Home)',            'toggle', 'es'),
  ('feature_megatravel',    'true',  'feature_flags', 'Integración Megatravel',        'toggle', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- -----------------------------------------------------------------------
-- New feature flags (English)
-- -----------------------------------------------------------------------

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('feature_blog',          'true',  'feature_flags', 'Blog',                         'toggle', 'en'),
  ('feature_grupos',        'true',  'feature_flags', 'Group Trips',                  'toggle', 'en'),
  ('feature_eventos',       'true',  'feature_flags', 'Special Events',               'toggle', 'en'),
  ('feature_hoteles',       'true',  'feature_flags', 'Hotel Search',                 'toggle', 'en'),
  ('feature_newsletter',    'true',  'feature_flags', 'Newsletter Section (Home)',     'toggle', 'en'),
  ('feature_testimonials',  'true',  'feature_flags', 'Testimonials Section (Home)',   'toggle', 'en'),
  ('feature_faq',           'true',  'feature_flags', 'FAQ Section (Home)',            'toggle', 'en'),
  ('feature_megatravel',    'true',  'feature_flags', 'Megatravel Integration',        'toggle', 'en')
ON CONFLICT (key, locale) DO NOTHING;
