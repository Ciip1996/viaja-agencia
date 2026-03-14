-- Viaja Agencia - Initial Database Schema
-- Run this in your Supabase SQL Editor

-- Promotions (Ofertas HOT)
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  badge TEXT, -- e.g. 'HOT', 'Oferta', 'Nuevo', 'Último Momento'
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Packages (Paquetes de Viaje)
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  region TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty TEXT, -- 'relajado', 'moderado', 'aventura'
  includes TEXT, -- JSON or line-separated list
  excludes TEXT,
  itinerary_summary TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Destinations (Destinos)
CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  gallery TEXT[], -- Array of image URLs
  practical_info TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Testimonials (Testimonios)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_photo_url TEXT,
  trip_destination TEXT NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Group Trips (Viajes Grupales)
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
  is_active BOOLEAN DEFAULT true
);

-- Events (Eventos Especiales)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'boda', 'luna_de_miel', 'aniversario', 'corporativo'
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Blog Posts
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

-- FAQ (Preguntas Frecuentes)
CREATE TABLE IF NOT EXISTS faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Site Settings (Configuración General)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access (anonymous users can read active content)
CREATE POLICY "Public can read active promotions" ON promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active packages" ON packages FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active destinations" ON destinations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active group_trips" ON group_trips FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published blog_posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active faq" ON faq FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);

-- Authenticated users (admin) have full access
CREATE POLICY "Admin full access promotions" ON promotions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access packages" ON packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access destinations" ON destinations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access group_trips" ON group_trips FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access faq" ON faq FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can view, authenticated can upload
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
