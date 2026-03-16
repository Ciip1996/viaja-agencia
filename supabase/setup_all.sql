-- ============================================================
-- Viaja Agencia — Complete Database Setup
-- Run this ONCE in Supabase SQL Editor
-- Safe to re-run (uses IF NOT EXISTS, ON CONFLICT DO NOTHING)
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  badge TEXT,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  region TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty TEXT,
  includes TEXT,
  excludes TEXT,
  itinerary_summary TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  gallery TEXT[],
  practical_info TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS group_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  description TEXT,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  max_travelers INTEGER NOT NULL,
  current_travelers INTEGER DEFAULT 0,
  price_usd NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  author TEXT DEFAULT 'Viaja Agencia',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  category TEXT NOT NULL DEFAULT 'general',
  label TEXT NOT NULL DEFAULT '',
  field_type TEXT NOT NULL DEFAULT 'text',
  locale TEXT NOT NULL DEFAULT 'es',
  PRIMARY KEY (key, locale)
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'wizard',
  status TEXT NOT NULL DEFAULT 'nueva',
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  destination TEXT,
  travel_type TEXT,
  check_in DATE,
  check_out DATE,
  adults INT DEFAULT 2,
  children INT DEFAULT 0,
  budget_range TEXT,
  notes TEXT,
  chat_history JSONB,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  locale TEXT NOT NULL DEFAULT 'es',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  travel_type TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active promotions') THEN
    CREATE POLICY "Public can read active promotions" ON promotions FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active packages') THEN
    CREATE POLICY "Public can read active packages" ON packages FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active destinations') THEN
    CREATE POLICY "Public can read active destinations" ON destinations FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active group_trips') THEN
    CREATE POLICY "Public can read active group_trips" ON group_trips FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active events') THEN
    CREATE POLICY "Public can read active events" ON events FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read published blog_posts') THEN
    CREATE POLICY "Public can read published blog_posts" ON blog_posts FOR SELECT USING (is_published = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active faq') THEN
    CREATE POLICY "Public can read active faq" ON faq FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read site_settings') THEN
    CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
  END IF;
END $$;

-- Admin full access policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access promotions') THEN
    CREATE POLICY "Admin full access promotions" ON promotions FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access packages') THEN
    CREATE POLICY "Admin full access packages" ON packages FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access destinations') THEN
    CREATE POLICY "Admin full access destinations" ON destinations FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access group_trips') THEN
    CREATE POLICY "Admin full access group_trips" ON group_trips FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access events') THEN
    CREATE POLICY "Admin full access events" ON events FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access blog_posts') THEN
    CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access faq') THEN
    CREATE POLICY "Admin full access faq" ON faq FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access site_settings') THEN
    CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Quote requests, newsletter, contacts policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert quote_requests') THEN
    CREATE POLICY "Public can insert quote_requests" ON quote_requests FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth can manage quote_requests') THEN
    CREATE POLICY "Auth can manage quote_requests" ON quote_requests FOR ALL TO authenticated USING (true);
  END IF;
  -- Removed: anon SELECT on quote_requests (PII leak — only authenticated users should read quotes)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert newsletter') THEN
    CREATE POLICY "Public can insert newsletter" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth can manage newsletter') THEN
    CREATE POLICY "Auth can manage newsletter" ON newsletter_subscribers FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert contact') THEN
    CREATE POLICY "Public can insert contact" ON contact_submissions FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth can manage contact') THEN
    CREATE POLICY "Auth can manage contact" ON contact_submissions FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- ============================================================
-- 3. STORAGE BUCKET
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view images' AND tablename = 'objects') THEN
    CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can upload images' AND tablename = 'objects') THEN
    CREATE POLICY "Admin can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can update images' AND tablename = 'objects') THEN
    CREATE POLICY "Admin can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can delete images' AND tablename = 'objects') THEN
    CREATE POLICY "Admin can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- ============================================================
-- 4. i18n LOCALE COLUMNS on content tables
-- ============================================================

ALTER TABLE promotions ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE faq ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE group_trips ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE events ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'es';

ALTER TABLE group_trips ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ============================================================
-- 6. SEED: Site Settings (Spanish)
-- ============================================================

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('company_name', 'Viaja Agencia', 'general', 'Nombre de empresa', 'text', 'es'),
  ('legal_name', 'Grupo Turístico del Centro-Occidente, S.A. de C.V.', 'general', 'Razón social', 'text', 'es'),
  ('address', 'Nube #522, Col. Jardines del Moral, C.P. 37160, León, Gto., México', 'general', 'Dirección', 'textarea', 'es'),
  ('phone', '477 779 0610 ext 102 al 115', 'general', 'Teléfono', 'tel', 'es'),
  ('email', 'reservaciones@viajaagencia.com.mx', 'general', 'Email', 'email', 'es'),
  ('whatsapp', 'https://wa.me/524777790610?text=Hola%2C%20me%20interesa%20cotizar%20un%20viaje', 'general', 'WhatsApp URL', 'url', 'es'),
  ('facebook', 'https://facebook.com/viajaagencia', 'general', 'Facebook URL', 'url', 'es'),
  ('instagram', 'https://instagram.com/viajaagencia', 'general', 'Instagram URL', 'url', 'es'),
  ('years_experience', '20', 'general', 'Años de experiencia', 'number', 'es'),
  ('horario', 'Lun — Vie: 9:00 — 19:00 · Sáb: 10:00 — 14:00', 'general', 'Horario', 'text', 'es'),
  ('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.041388161214!2d-101.69539441146757!3d21.15075113032543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbf467929d2cf%3A0xf87c4906456d0a1f!2sViaja%20Agencia!5e0!3m2!1ses-419!2smx', 'general', 'Google Maps Embed URL', 'url', 'es'),
  ('logo_url', '/logo-viaja.png', 'general', 'Logo URL', 'image', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage hero
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('hero_tagline', 'Viaja Agencia — Donde Todo Viaje Comienza', 'homepage_hero', 'Tagline', 'text', 'es'),
  ('hero_heading', 'Explora el Mundo', 'homepage_hero', 'Título principal', 'text', 'es'),
  ('hero_subtitle', 'Disfruta de Aventuras Inolvidables: Descubre tu Mundo con Viaja Agencia... Donde Todo Viaje Comienza', 'homepage_hero', 'Subtítulo', 'textarea', 'es'),
  ('hero_video_url', '/videos/viaja_hero.webm', 'homepage_hero', 'Video URL', 'url', 'es'),
  ('hero_poster_url', '/images/site/hero-bg.png', 'homepage_hero', 'Poster imagen', 'image', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage offers
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('hotdeals_tag', 'Mejores Ofertas', 'homepage_ofertas', 'Etiqueta', 'text', 'es'),
  ('hotdeals_heading', 'Mira nuestros paquetes mejor calificados', 'homepage_ofertas', 'Título', 'text', 'es'),
  ('hotdeals_price_label', 'por pareja', 'homepage_ofertas', 'Etiqueta de precio', 'text', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage why choose us
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('why_tag', 'Por qué elegirnos', 'homepage_porque', 'Etiqueta', 'text', 'es'),
  ('why_heading', 'Tu Viaje en las Mejores Manos', 'homepage_porque', 'Título', 'text', 'es'),
  ('why_description', 'Somos la agencia con más de 20 años de experiencia que cuenta con IATA y que nos adaptamos a tu estilo y presupuesto', 'homepage_porque', 'Descripción', 'textarea', 'es'),
  ('why_pillars', '[{"icon":"Wallet","title":"Aventuras a tu Alcance","description":"Explora el mundo de forma asequible con Viaja Agencia."},{"icon":"Globe","title":"Destinos sin Límites, Memorias Infinitas","description":"Con Viaja Agencia el mundo te pertenece."},{"icon":"Headphones","title":"Servicio Excepcional, En Cada Paso del Camino","description":"Nuestro equipo especializado te brinda un servicio profesional de inicio a fin."},{"icon":"Map","title":"Tus Viajes de Ensueño, Nuestra Experiencia","description":"Confía en los expertos de Viaja Agencia."}]', 'homepage_porque', 'Pilares (JSON)', 'json', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage destinations
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('destinations_tag', 'Destinos', 'homepage_destinos', 'Etiqueta', 'text', 'es'),
  ('destinations_heading', 'Destinos para Todos los Gustos', 'homepage_destinos', 'Título', 'text', 'es'),
  ('destinations_description', '12 regiones del mundo esperan por ti', 'homepage_destinos', 'Descripción', 'text', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage testimonials
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('testimonials_tag', 'Testimonios', 'homepage_testimonios', 'Etiqueta', 'text', 'es'),
  ('testimonials_heading', 'Lo Que Dicen Nuestros Viajeros', 'homepage_testimonios', 'Título', 'text', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage newsletter
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('newsletter_tag', 'Newsletter', 'homepage_newsletter', 'Etiqueta', 'text', 'es'),
  ('newsletter_heading', '¡Mantente Informado con Nuestras Noticias!', 'homepage_newsletter', 'Título', 'text', 'es'),
  ('newsletter_description', 'Suscríbete a nuestro newsletter y sé el primero en conocer promociones exclusivas, destinos de temporada y las últimas novedades de Viaja Agencia.', 'homepage_newsletter', 'Descripción', 'textarea', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage FAQ
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('faq_tag', 'Ayuda', 'homepage_faq', 'Etiqueta', 'text', 'es'),
  ('faq_heading', 'Preguntas Frecuentes', 'homepage_faq', 'Título', 'text', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Homepage Instagram
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('instagram_handle', 'viajaagencia', 'homepage_instagram', 'Handle de Instagram', 'text', 'es'),
  ('instagram_heading', 'Síguenos en Instagram', 'homepage_instagram', 'Título', 'text', 'es'),
  ('instagram_description', 'Inspírate con destinos increíbles, tips de viaje y las mejores promociones.', 'homepage_instagram', 'Descripción', 'textarea', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- Page heroes (Spanish)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('paquetes_hero_image', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80', 'page_paquetes', 'Hero imagen', 'image', 'es'),
  ('paquetes_hero_tag', 'Paquetes Exclusivos', 'page_paquetes', 'Hero etiqueta', 'text', 'es'),
  ('paquetes_hero_heading', 'Viajes Inolvidables', 'page_paquetes', 'Hero título', 'text', 'es'),
  ('paquetes_hero_description', 'Paquetes diseñados con atención al detalle para que solo te preocupes por disfrutar.', 'page_paquetes', 'Hero descripción', 'textarea', 'es'),
  ('paquetes_megatravel_url', 'https://www.megatravel.com.mx/tools/ofertas-viaje.php?Dest=&txtColor=1D1D1D&lblTPaq=2667FF&lblTRange=062D97&lblNumRange=1DCEC8&itemBack=EFF4FF&ItemHov=062D97&txtColorHov=ffffff&ff=1', 'page_paquetes', 'Megatravel iframe URL', 'url', 'es'),
  ('eventos_hero_image', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80', 'page_eventos', 'Hero imagen', 'image', 'es'),
  ('eventos_hero_tag', 'Eventos Especiales', 'page_eventos', 'Hero etiqueta', 'text', 'es'),
  ('eventos_hero_heading', 'Momentos Extraordinarios', 'page_eventos', 'Hero título', 'text', 'es'),
  ('eventos_megatravel_url', 'https://www.megatravel.com.mx/tools/vi.php?Dest=12&txtColor=1D1D1D&lblTPaq=2667FF&lblTRange=062D97&lblNumRange=1DCEC8&itemBack=EFF4FF&ItemHov=062D97&txtColorHov=ffffff&ff=1', 'page_eventos', 'Megatravel iframe URL', 'url', 'es'),
  ('destinos_hero_image', 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80', 'page_destinos', 'Hero imagen', 'image', 'es'),
  ('destinos_hero_tag', 'Destinos Mundiales', 'page_destinos', 'Hero etiqueta', 'text', 'es'),
  ('destinos_hero_heading', 'Destinos para Todos los Gustos', 'page_destinos', 'Hero título', 'text', 'es'),
  ('nosotros_hero_image', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80', 'page_nosotros', 'Hero imagen', 'image', 'es'),
  ('nosotros_hero_tag', 'Viaja Agencia', 'page_nosotros', 'Hero etiqueta', 'text', 'es'),
  ('nosotros_hero_heading', 'Creamos Experiencias', 'page_nosotros', 'Hero título', 'text', 'es'),
  ('nosotros_stats', '[{"value":"20+","label":"Años de experiencia"},{"value":"10,000+","label":"Viajeros felices"},{"value":"50+","label":"Destinos mundiales"},{"value":"500+","label":"Vuelos gestionados al año"}]', 'page_nosotros', 'Estadísticas (JSON)', 'json', 'es'),
  ('contacto_hero_image', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80', 'page_contacto', 'Hero imagen', 'image', 'es'),
  ('contacto_hero_tag', 'Hablemos', 'page_contacto', 'Hero etiqueta', 'text', 'es'),
  ('contacto_hero_heading', 'Contáctanos', 'page_contacto', 'Hero título', 'text', 'es'),
  ('grupos_hero_image', 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1920&q=80', 'page_grupos', 'Hero imagen', 'image', 'es'),
  ('grupos_hero_tag', 'Viajes en Grupo', 'page_grupos', 'Hero etiqueta', 'text', 'es'),
  ('grupos_hero_heading', 'Aventuras Compartidas', 'page_grupos', 'Hero título', 'text', 'es'),
  ('hoteles_hero_image', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80', 'page_hoteles', 'Hero imagen', 'image', 'es'),
  ('hoteles_hero_tag', 'Hospedaje Premium', 'page_hoteles', 'Hero etiqueta', 'text', 'es'),
  ('hoteles_hero_heading', 'Los Mejores Hoteles del Mundo', 'page_hoteles', 'Hero título', 'text', 'es'),
  ('tours_hero_image', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1920&q=80', 'page_tours', 'Hero imagen', 'image', 'es'),
  ('tours_hero_tag', 'Tours y Excursiones', 'page_tours', 'Hero etiqueta', 'text', 'es'),
  ('tours_hero_heading', 'Experiencias Únicas', 'page_tours', 'Hero título', 'text', 'es'),
  ('autos_hero_image', 'https://images.unsplash.com/photo-1449965408869-ebd3fee6b5e7?w=1920&q=80', 'page_autos', 'Hero imagen', 'image', 'es'),
  ('autos_hero_tag', 'Renta de Autos', 'page_autos', 'Hero etiqueta', 'text', 'es'),
  ('autos_hero_heading', 'Tu Auto en Cualquier Destino', 'page_autos', 'Hero título', 'text', 'es')
ON CONFLICT (key, locale) DO NOTHING;

-- ============================================================
-- 7. SEED: Site Settings (English)
-- ============================================================

-- Copy general to English
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

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('hotdeals_tag', 'Best Deals', 'homepage_ofertas', 'Section Tag', 'text', 'en'),
  ('hotdeals_heading', 'Check out our top-rated packages', 'homepage_ofertas', 'Section Heading', 'text', 'en'),
  ('hotdeals_price_label', 'per couple', 'homepage_ofertas', 'Price Label', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('destinations_tag', 'Destinations', 'homepage_destinos', 'Section Tag', 'text', 'en'),
  ('destinations_heading', 'Destinations for Every Taste', 'homepage_destinos', 'Section Heading', 'text', 'en'),
  ('destinations_description', '12 world regions await you', 'homepage_destinos', 'Section Description', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('why_tag', 'Why choose us', 'homepage_porque', 'Section Tag', 'text', 'en'),
  ('why_heading', 'Your Trip in the Best Hands', 'homepage_porque', 'Section Heading', 'text', 'en'),
  ('why_description', 'We are the agency with over 20 years of experience, IATA certified, adapting to your style and budget', 'homepage_porque', 'Section Description', 'textarea', 'en')
ON CONFLICT (key, locale) DO NOTHING;

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('testimonials_tag', 'Testimonials', 'homepage_testimonios', 'Section Tag', 'text', 'en'),
  ('testimonials_heading', 'What Our Travelers Say', 'homepage_testimonios', 'Section Heading', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('newsletter_tag', 'Newsletter', 'homepage_newsletter', 'Section Tag', 'text', 'en'),
  ('newsletter_heading', 'Stay Informed with Our News!', 'homepage_newsletter', 'Section Heading', 'text', 'en'),
  ('newsletter_description', 'Subscribe to our newsletter and be the first to learn about exclusive promotions, seasonal destinations, and the latest news from Viaja Agencia.', 'homepage_newsletter', 'Section Description', 'textarea', 'en')
ON CONFLICT (key, locale) DO NOTHING;

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('instagram_handle', 'viajaagencia', 'homepage_instagram', 'Handle', 'text', 'en'),
  ('instagram_heading', 'Follow Us on Instagram', 'homepage_instagram', 'Section Heading', 'text', 'en'),
  ('instagram_description', 'Get inspired by amazing destinations, travel tips, and the best deals.', 'homepage_instagram', 'Section Description', 'textarea', 'en')
ON CONFLICT (key, locale) DO NOTHING;

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('faq_tag', 'Help', 'homepage_faq', 'Section Tag', 'text', 'en'),
  ('faq_heading', 'Frequently Asked Questions', 'homepage_faq', 'Section Heading', 'text', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- Page heroes (English)
INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('destinos_hero_tag', 'Worldwide Destinations', 'page_destinos', 'Hero Tag', 'text', 'en'),
  ('destinos_hero_heading', 'Destinations for Every Taste', 'page_destinos', 'Hero Heading', 'text', 'en'),
  ('destinos_hero_image', '', 'page_destinos', 'Hero Image', 'image', 'en'),
  ('paquetes_hero_tag', 'Exclusive Packages', 'page_paquetes', 'Hero Tag', 'text', 'en'),
  ('paquetes_hero_heading', 'Unforgettable Trips', 'page_paquetes', 'Hero Heading', 'text', 'en'),
  ('paquetes_hero_description', 'Packages designed with attention to detail so you only worry about enjoying.', 'page_paquetes', 'Hero Description', 'textarea', 'en'),
  ('paquetes_hero_image', '', 'page_paquetes', 'Hero Image', 'image', 'en'),
  ('grupos_hero_tag', 'Group Trips', 'page_grupos', 'Hero Tag', 'text', 'en'),
  ('grupos_hero_heading', 'Shared Adventures', 'page_grupos', 'Hero Heading', 'text', 'en'),
  ('grupos_hero_image', '', 'page_grupos', 'Hero Image', 'image', 'en'),
  ('eventos_hero_tag', 'Special Events', 'page_eventos', 'Hero Tag', 'text', 'en'),
  ('eventos_hero_heading', 'Extraordinary Moments', 'page_eventos', 'Hero Heading', 'text', 'en'),
  ('eventos_hero_image', '', 'page_eventos', 'Hero Image', 'image', 'en'),
  ('nosotros_hero_tag', 'Our Story', 'page_nosotros', 'Hero Tag', 'text', 'en'),
  ('nosotros_hero_heading', 'We Create Experiences', 'page_nosotros', 'Hero Heading', 'text', 'en'),
  ('nosotros_hero_image', '', 'page_nosotros', 'Hero Image', 'image', 'en'),
  ('contacto_hero_tag', 'Let''s Talk', 'page_contacto', 'Hero Tag', 'text', 'en'),
  ('contacto_hero_heading', 'Contact Us', 'page_contacto', 'Hero Heading', 'text', 'en'),
  ('contacto_hero_image', '', 'page_contacto', 'Hero Image', 'image', 'en'),
  ('hoteles_hero_tag', 'Premium Accommodation', 'page_hoteles', 'Hero Tag', 'text', 'en'),
  ('hoteles_hero_heading', 'The World''s Best Hotels', 'page_hoteles', 'Hero Heading', 'text', 'en'),
  ('hoteles_hero_image', '', 'page_hoteles', 'Hero Image', 'image', 'en'),
  ('tours_hero_tag', 'Unique Experiences', 'page_tours', 'Hero Tag', 'text', 'en'),
  ('tours_hero_heading', 'Unique Experiences', 'page_tours', 'Hero Heading', 'text', 'en'),
  ('tours_hero_image', '', 'page_tours', 'Hero Image', 'image', 'en'),
  ('autos_hero_tag', 'Unlimited Mobility', 'page_autos', 'Hero Tag', 'text', 'en'),
  ('autos_hero_heading', 'Your Car at Any Destination', 'page_autos', 'Hero Heading', 'text', 'en'),
  ('autos_hero_image', '', 'page_autos', 'Hero Image', 'image', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- ============================================================
-- 8. FEATURE FLAGS
-- ============================================================

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
  ('feature_blog',          'true',  'feature_flags', 'Blog',                         'toggle', 'es'),
  ('feature_grupos',        'true',  'feature_flags', 'Viajes Grupales',              'toggle', 'es'),
  ('feature_eventos',       'true',  'feature_flags', 'Eventos Especiales',           'toggle', 'es'),
  ('feature_tours',         'false', 'feature_flags', 'Tours y Excursiones',          'toggle', 'es'),
  ('feature_autos',         'false', 'feature_flags', 'Renta de Autos',              'toggle', 'es'),
  ('feature_hoteles',       'true',  'feature_flags', 'Buscador de Hoteles',          'toggle', 'es'),
  ('feature_hotel_booking', 'false', 'feature_flags', 'Botón Reservar Hoteles',       'toggle', 'es'),
  ('feature_chatbot',       'false', 'feature_flags', 'Agente Virtual (Chatbot IA)',   'toggle', 'es'),
  ('feature_instagram',     'false', 'feature_flags', 'Feed de Instagram',            'toggle', 'es'),
  ('feature_newsletter',    'true',  'feature_flags', 'Sección Newsletter (Home)',     'toggle', 'es'),
  ('feature_testimonials',  'true',  'feature_flags', 'Sección Testimonios (Home)',    'toggle', 'es'),
  ('feature_faq',           'true',  'feature_flags', 'Sección FAQ (Home)',            'toggle', 'es'),
  ('feature_megatravel',    'true',  'feature_flags', 'Integración Megatravel',        'toggle', 'es'),
  ('feature_blog',          'true',  'feature_flags', 'Blog',                         'toggle', 'en'),
  ('feature_grupos',        'true',  'feature_flags', 'Group Trips',                  'toggle', 'en'),
  ('feature_eventos',       'true',  'feature_flags', 'Special Events',               'toggle', 'en'),
  ('feature_tours',         'false', 'feature_flags', 'Tours & Excursions',           'toggle', 'en'),
  ('feature_autos',         'false', 'feature_flags', 'Car Rental',                   'toggle', 'en'),
  ('feature_hoteles',       'true',  'feature_flags', 'Hotel Search',                 'toggle', 'en'),
  ('feature_hotel_booking', 'false', 'feature_flags', 'Hotel Booking Button',         'toggle', 'en'),
  ('feature_chatbot',       'false', 'feature_flags', 'Virtual Agent (AI Chatbot)',    'toggle', 'en'),
  ('feature_instagram',     'false', 'feature_flags', 'Instagram Feed',               'toggle', 'en'),
  ('feature_newsletter',    'true',  'feature_flags', 'Newsletter Section (Home)',     'toggle', 'en'),
  ('feature_testimonials',  'true',  'feature_flags', 'Testimonials Section (Home)',   'toggle', 'en'),
  ('feature_faq',           'true',  'feature_flags', 'FAQ Section (Home)',            'toggle', 'en'),
  ('feature_megatravel',    'true',  'feature_flags', 'Megatravel Integration',        'toggle', 'en')
ON CONFLICT (key, locale) DO NOTHING;

-- ============================================================
-- 9. API KEYS
-- ============================================================

INSERT INTO site_settings (key, value, category, label, field_type, locale) VALUES
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

-- Update RLS for api_keys security
DROP POLICY IF EXISTS "Public can read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public can view site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public can view non-secret site_settings" ON site_settings;

CREATE POLICY "Public can view non-secret site_settings"
  ON site_settings
  FOR SELECT
  TO anon
  USING (category <> 'api_keys');

-- ============================================================
-- 10. SEED DATA: Promotions
-- ============================================================

INSERT INTO promotions (title, description, destination, price_usd, badge, image_url, locale) VALUES
  ('Grecia Clásica', 'Atenas, Santorini y Mykonos. 8 días todo incluido con vuelos, hoteles boutique y tours privados por las islas más icónicas del Egeo.', 'Grecia', 7500, 'HOT', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', 'es'),
  ('Italia Romántica', 'Roma, Florencia y Venecia. 7 días recorriendo la cuna del Renacimiento con guías expertos, cenas gourmet y alojamiento premium.', 'Italia', 5500, NULL, 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80', 'es'),
  ('París de Ensueño', 'La Ciudad Luz como nunca la has vivido. 8 días con hotel boutique en Le Marais, crucero por el Sena y experiencias gastronómicas exclusivas.', 'París', 7500, 'HOT', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', 'es'),
  ('Maldivas Luxury', 'El paraíso existe. 7 días en villa sobre el agua con todo incluido, snorkel, spa y cenas privadas en la playa.', 'Maldivas', 7500, 'Premium', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', 'es'),
  ('Marruecos Mágico', 'Marrakech, Fez y el desierto del Sahara. 8 días de inmersión cultural con riads de lujo, paseos en camello y cenas bajo las estrellas.', 'Marruecos', 5500, NULL, 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80', 'es'),
  ('Japón Imperial', 'Tokio, Kioto y Osaka. 10 días descubriendo la perfecta armonía entre tradición milenaria y tecnología de vanguardia.', 'Japón', 7500, 'HOT', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', 'es')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. SEED DATA: Destinations (12 regions)
-- ============================================================

INSERT INTO destinations (name, region, description, display_order, locale) VALUES
  ('Europa', 'Europa', 'Descubre la magia del viejo continente: historia, cultura, gastronomía y paisajes inolvidables desde las costas del Mediterráneo hasta los fiordos nórdicos.', 1, 'es'),
  ('Medio Oriente', 'Medio Oriente', 'Sumérgete en un mundo de contrastes fascinantes: desiertos dorados, ciudades futuristas y tradiciones milenarias que te dejarán sin aliento.', 2, 'es'),
  ('Asia', 'Asia', 'Desde templos ancestrales hasta metrópolis vibrantes, Asia te ofrece una experiencia sensorial completa con sabores, colores y sonidos únicos.', 3, 'es'),
  ('Pacífico', 'Pacífico', 'Islas paradisíacas, aguas cristalinas y atardeceres de ensueño. El Pacífico es el destino perfecto para reconectar con la naturaleza.', 4, 'es'),
  ('África', 'África', 'Safaris épicos, culturas vibrantes y paisajes que van desde el Sahara hasta las cataratas Victoria. África es aventura en estado puro.', 5, 'es'),
  ('Sudamérica', 'Sudamérica', 'Desde Machu Picchu hasta la Patagonia, Sudamérica combina maravillas naturales con una cultura rica y gastronomía excepcional.', 6, 'es'),
  ('Centroamérica', 'Centroamérica', 'Playas caribeñas, ruinas mayas, volcanes activos y una biodiversidad increíble te esperan en el corazón de las Américas.', 7, 'es'),
  ('Cuba y el Caribe', 'Caribe', 'Sol, arena blanca, aguas turquesa y ritmos tropicales. El Caribe es sinónimo de relajación y alegría pura.', 8, 'es'),
  ('Estados Unidos', 'Norteamérica', 'Desde Nueva York hasta Los Ángeles, parques nacionales épicos y ciudades icónicas. La diversidad de experiencias es infinita.', 9, 'es'),
  ('Canadá', 'Norteamérica', 'Naturaleza salvaje, ciudades cosmopolitas y las auroras boreales. Canadá ofrece experiencias únicas en cada estación del año.', 10, 'es'),
  ('México', 'México', 'Nuestro hermoso país: playas paradisíacas, sitios arqueológicos, ciudades coloniales y la mejor gastronomía del mundo.', 11, 'es'),
  ('Cruceros', 'Cruceros', 'Navega por los mares del mundo con todo incluido. Lujo, entretenimiento y múltiples destinos en un solo viaje.', 12, 'es')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 12. SEED DATA: FAQ
-- ============================================================

INSERT INTO faq (question, answer, display_order, locale) VALUES
  ('¿Cómo puedo comenzar a planificar mi viaje con Viaja Agencia?', 'Es muy sencillo. Puedes contactarnos por teléfono al 477 779 0610, por WhatsApp, por correo electrónico a reservaciones@viajaagencia.com.mx o visitarnos en nuestras oficinas en León, Guanajuato. Uno de nuestros asesores te atenderá de forma personalizada para diseñar el viaje perfecto para ti.', 1, 'es'),
  ('¿En qué destinos se especializan?', 'Contamos con más de 20 años de experiencia ofreciendo viajes a todo el mundo. Nos especializamos en Europa, Asia, Medio Oriente, el Caribe y destinos nacionales. Trabajamos con los mejores proveedores internacionales para garantizar calidad y precio.', 2, 'es'),
  ('¿Pueden ayudarme con viajes grupales?', 'Por supuesto. Organizamos viajes grupales para familias, amigos, empresas y grupos especiales. Manejamos toda la logística: vuelos, hospedaje, tours y actividades, asegurándonos de que todos tengan una experiencia inolvidable.', 3, 'es'),
  ('¿Qué medidas de seguridad tienen durante el viaje?', 'Trabajamos únicamente con proveedores certificados y seguros de viaje internacionales. Además, ofrecemos asistencia 24/7 durante tu viaje para cualquier emergencia o imprevisto. Tu seguridad es nuestra prioridad número uno.', 4, 'es'),
  ('¿Qué tipo de soporte ofrecen durante el viaje?', 'Ofrecemos soporte 24/7 durante todo tu viaje. Puedes contactarnos por teléfono, WhatsApp o correo electrónico en cualquier momento. Nuestro equipo está preparado para ayudarte con cualquier situación.', 5, 'es'),
  ('¿Puedo modificar mis planes de viaje una vez confirmados?', 'Entendemos que los planes pueden cambiar. Trabajamos contigo para hacer las modificaciones necesarias sujetas a las políticas de cambio de cada proveedor. Te recomendamos contratar nuestro seguro de viaje que incluye protección ante cambios e imprevistos.', 6, 'es')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 13. TRANSLATION GROUP ID (links locale variants)
-- ============================================================

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE packages ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE group_trips ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE events ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();
ALTER TABLE faq ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid();

-- ============================================================
-- DONE! Your database is ready.
-- ============================================================
