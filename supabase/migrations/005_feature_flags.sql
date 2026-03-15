-- Feature Flags & API Keys
-- Uses existing site_settings table with new categories and field types

-- -----------------------------------------------------------------------
-- Feature flags (category: feature_flags, field_type: toggle)
-- -----------------------------------------------------------------------

INSERT INTO site_settings (key, value, category, label, field_type, locale)
VALUES
  ('feature_tours',         'false', 'feature_flags', 'Página de Tours',              'toggle', 'es'),
  ('feature_autos',         'false', 'feature_flags', 'Página de Renta de Autos',     'toggle', 'es'),
  ('feature_chatbot',       'false', 'feature_flags', 'Agente Virtual (Chatbot IA)',   'toggle', 'es'),
  ('feature_instagram',     'false', 'feature_flags', 'Feed de Instagram',            'toggle', 'es'),
  ('feature_hotel_booking', 'false', 'feature_flags', 'Botón Reservar Hoteles',       'toggle', 'es'),
  ('feature_tours',         'false', 'feature_flags', 'Tours Page',                   'toggle', 'en'),
  ('feature_autos',         'false', 'feature_flags', 'Car Rental Page',              'toggle', 'en'),
  ('feature_chatbot',       'false', 'feature_flags', 'Virtual Agent (AI Chatbot)',   'toggle', 'en'),
  ('feature_instagram',     'false', 'feature_flags', 'Instagram Feed',              'toggle', 'en'),
  ('feature_hotel_booking', 'false', 'feature_flags', 'Hotel Booking Button',        'toggle', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- -----------------------------------------------------------------------
-- API Keys (category: api_keys, field_type: secret)
-- -----------------------------------------------------------------------

INSERT INTO site_settings (key, value, category, label, field_type, locale)
VALUES
  ('openai_api_key',       '', 'api_keys', 'OpenAI API Key',             'secret', 'es'),
  ('hotelbeds_api_key',    '', 'api_keys', 'Hotelbeds API Key',          'secret', 'es'),
  ('hotelbeds_secret',     '', 'api_keys', 'Hotelbeds Secret',           'secret', 'es'),
  ('hotelbeds_base_url',   'https://api.test.hotelbeds.com/hotel-api/1.0', 'api_keys', 'Hotelbeds Base URL', 'text', 'es'),
  ('resend_api_key',       '', 'api_keys', 'Resend API Key',             'secret', 'es'),
  ('resend_from_email',    '', 'api_keys', 'Resend From Email',          'text',   'es'),
  ('google_places_api_key','', 'api_keys', 'Google Places API Key',      'secret', 'es'),
  ('openai_api_key',       '', 'api_keys', 'OpenAI API Key',             'secret', 'en'),
  ('hotelbeds_api_key',    '', 'api_keys', 'Hotelbeds API Key',          'secret', 'en'),
  ('hotelbeds_secret',     '', 'api_keys', 'Hotelbeds Secret',           'secret', 'en'),
  ('hotelbeds_base_url',   'https://api.test.hotelbeds.com/hotel-api/1.0', 'api_keys', 'Hotelbeds Base URL', 'text', 'en'),
  ('resend_api_key',       '', 'api_keys', 'Resend API Key',             'secret', 'en'),
  ('resend_from_email',    '', 'api_keys', 'Resend From Email',          'text',   'en'),
  ('google_places_api_key','', 'api_keys', 'Google Places API Key',      'secret', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- -----------------------------------------------------------------------
-- Update RLS: anon cannot read api_keys category
-- -----------------------------------------------------------------------

DROP POLICY IF EXISTS "Public can view site_settings" ON site_settings;

CREATE POLICY "Public can view non-secret site_settings"
  ON site_settings
  FOR SELECT
  TO anon
  USING (category <> 'api_keys');
