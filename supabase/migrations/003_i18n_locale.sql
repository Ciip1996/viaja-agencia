-- Add locale column to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';

-- Update unique constraint to include locale
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_key_key;
ALTER TABLE site_settings ADD CONSTRAINT site_settings_key_locale_key UNIQUE (key, locale);

-- Set existing rows to Spanish
UPDATE site_settings SET locale = 'es' WHERE locale = 'es';

-- Add locale column to content tables
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE faq ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE group_trips ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE events ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';

-- Insert English CMS content (site_settings)
-- General category stays the same (URLs/phones are language-independent)
-- Only content categories need English versions

INSERT INTO site_settings (key, value, category, label, field_type, locale)
SELECT key, value, category, label, field_type, 'en'
FROM site_settings
WHERE locale = 'es' AND category = 'general'
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage hero (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('hero_tagline', 'Viaja Agencia — Where Every Trip Begins', 'homepage_hero', 'Hero Tagline', 'text', 'en'),
('hero_heading', 'Explore the World', 'homepage_hero', 'Hero Heading', 'text', 'en'),
('hero_subtitle', 'Enjoy Unforgettable Adventures: Discover Your World with Viaja Agencia... Where Every Trip Begins', 'homepage_hero', 'Hero Subtitle', 'textarea', 'en'),
('hero_video_url', '/videos/viaja_hero.webm', 'homepage_hero', 'Hero Video URL', 'url', 'en'),
('hero_poster_url', '/images/site/hero-bg.png', 'homepage_hero', 'Hero Poster URL', 'url', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage offers (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('hotdeals_tag', 'Best Deals', 'homepage_ofertas', 'Section Tag', 'text', 'en'),
('hotdeals_heading', 'Check out our top-rated packages', 'homepage_ofertas', 'Section Heading', 'text', 'en'),
('hotdeals_price_label', 'per couple', 'homepage_ofertas', 'Price Label', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage destinations (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('destinations_tag', 'Destinations', 'homepage_destinos', 'Section Tag', 'text', 'en'),
('destinations_heading', 'Destinations for Every Taste', 'homepage_destinos', 'Section Heading', 'text', 'en'),
('destinations_description', '12 world regions await you', 'homepage_destinos', 'Section Description', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage why choose us (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('why_tag', 'Why choose us', 'homepage_porque', 'Section Tag', 'text', 'en'),
('why_heading', 'Your Trip in the Best Hands', 'homepage_porque', 'Section Heading', 'text', 'en'),
('why_description', 'We are the agency with over 20 years of experience, IATA certified, adapting to your style and budget', 'homepage_porque', 'Section Description', 'textarea', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage testimonials (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('testimonials_tag', 'Testimonials', 'homepage_testimonios', 'Section Tag', 'text', 'en'),
('testimonials_heading', 'What Our Travelers Say', 'homepage_testimonios', 'Section Heading', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage newsletter (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('newsletter_tag', 'Newsletter', 'homepage_newsletter', 'Section Tag', 'text', 'en'),
('newsletter_heading', 'Stay Informed with Our News!', 'homepage_newsletter', 'Section Heading', 'text', 'en'),
('newsletter_description', 'Subscribe to our newsletter and be the first to learn about exclusive promotions, seasonal destinations, and the latest news from Viaja Agencia.', 'homepage_newsletter', 'Section Description', 'textarea', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage instagram (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('instagram_handle', 'viajaagencia', 'homepage_instagram', 'Handle', 'text', 'en'),
('instagram_heading', 'Follow Us on Instagram', 'homepage_instagram', 'Section Heading', 'text', 'en'),
('instagram_description', 'Get inspired by amazing destinations, travel tips, and the best deals. Join our travel community.', 'homepage_instagram', 'Section Description', 'textarea', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage FAQ (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('faq_tag', 'Help', 'homepage_faq', 'Section Tag', 'text', 'en'),
('faq_heading', 'Frequently Asked Questions', 'homepage_faq', 'Section Heading', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Page heroes (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
('hero_tag', 'Worldwide Destinations', 'page_destinos', 'Hero Tag', 'text', 'en'),
('hero_heading', 'Destinations for Every Taste', 'page_destinos', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_destinos', 'Hero Image', 'image', 'en'),

('hero_tag', 'Exclusive Packages', 'page_paquetes', 'Hero Tag', 'text', 'en'),
('hero_heading', 'Unforgettable Trips', 'page_paquetes', 'Hero Heading', 'text', 'en'),
('hero_description', 'Packages designed with attention to detail so you only worry about enjoying.', 'page_paquetes', 'Hero Description', 'textarea', 'en'),
('hero_image', '', 'page_paquetes', 'Hero Image', 'image', 'en'),

('hero_tag', 'Group Trips', 'page_grupos', 'Hero Tag', 'text', 'en'),
('hero_heading', 'Shared Adventures', 'page_grupos', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_grupos', 'Hero Image', 'image', 'en'),

('hero_tag', 'Special Events', 'page_eventos', 'Hero Tag', 'text', 'en'),
('hero_heading', 'Extraordinary Moments', 'page_eventos', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_eventos', 'Hero Image', 'image', 'en'),

('hero_tag', 'Our Story', 'page_nosotros', 'Hero Tag', 'text', 'en'),
('hero_heading', 'We Create Experiences', 'page_nosotros', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_nosotros', 'Hero Image', 'image', 'en'),

('hero_tag', 'Let''s Talk', 'page_contacto', 'Hero Tag', 'text', 'en'),
('hero_heading', 'Contact Us', 'page_contacto', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_contacto', 'Hero Image', 'image', 'en'),

('hero_tag', 'Premium Accommodation', 'page_hoteles', 'Hero Tag', 'text', 'en'),
('hero_heading', 'The World''s Best Hotels', 'page_hoteles', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_hoteles', 'Hero Image', 'image', 'en'),

('hero_tag', 'Unique Experiences', 'page_tours', 'Hero Tag', 'text', 'en'),
('hero_heading', 'Unique Experiences', 'page_tours', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_tours', 'Hero Image', 'image', 'en'),

('hero_tag', 'Unlimited Mobility', 'page_autos', 'Hero Tag', 'text', 'en'),
('hero_heading', 'Your Car at Any Destination', 'page_autos', 'Hero Heading', 'text', 'en'),
('hero_image', '', 'page_autos', 'Hero Image', 'image', 'en')
ON CONFLICT (key, locale) DO NOTHING;
