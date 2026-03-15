-- CMS Content Management: Expand site_settings for full content management
-- Applied: 2026-03-13

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS label TEXT NOT NULL DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS field_type TEXT NOT NULL DEFAULT 'text';
-- field_type: 'text' | 'textarea' | 'url' | 'image' | 'json' | 'number' | 'email' | 'tel'

-- Update existing general rows
UPDATE site_settings SET category = 'general', label = 'Nombre de empresa', field_type = 'text' WHERE key = 'company_name';
UPDATE site_settings SET category = 'general', label = 'Razón social', field_type = 'text' WHERE key = 'legal_name';
UPDATE site_settings SET category = 'general', label = 'Dirección', field_type = 'textarea' WHERE key = 'address';
UPDATE site_settings SET category = 'general', label = 'Teléfono', field_type = 'tel' WHERE key = 'phone';
UPDATE site_settings SET category = 'general', label = 'Email', field_type = 'email' WHERE key = 'email';
UPDATE site_settings SET category = 'general', label = 'WhatsApp URL', field_type = 'url' WHERE key = 'whatsapp';
UPDATE site_settings SET category = 'general', label = 'Facebook URL', field_type = 'url' WHERE key = 'facebook';
UPDATE site_settings SET category = 'general', label = 'Instagram URL', field_type = 'url' WHERE key = 'instagram';
UPDATE site_settings SET category = 'general', label = 'Años de experiencia', field_type = 'number' WHERE key = 'years_experience';

-- General: additional keys
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('horario', 'Lun — Vie: 9:00 — 19:00 · Sáb: 10:00 — 14:00', 'general', 'Horario', 'text'),
  ('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.041388161214!2d-101.69539441146757!3d21.15075113032543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbf467929d2cf%3A0xf87c4906456d0a1f!2sViaja%20Agencia!5e0!3m2!1ses-419!2smx', 'general', 'Google Maps Embed URL', 'url'),
  ('logo_url', '/logo-viaja.png', 'general', 'Logo URL', 'image')
ON CONFLICT (key) DO NOTHING;

-- Homepage Hero
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('hero_tagline', 'Viaja Agencia — Donde Todo Viaje Comienza', 'homepage_hero', 'Tagline', 'text'),
  ('hero_heading', 'Explora el Mundo', 'homepage_hero', 'Título principal', 'text'),
  ('hero_subtitle', 'Disfruta de Aventuras Inolvidables: Descubre tu Mundo con Viaja Agencia... Donde Todo Viaje Comienza', 'homepage_hero', 'Subtítulo', 'textarea'),
  ('hero_video_url', '/videos/viaja_hero.webm', 'homepage_hero', 'Video URL', 'url'),
  ('hero_poster_url', '/images/site/hero-bg.png', 'homepage_hero', 'Poster imagen', 'image')
ON CONFLICT (key) DO NOTHING;

-- Homepage Hot Deals
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('hotdeals_tag', 'Mejores Ofertas', 'homepage_ofertas', 'Etiqueta', 'text'),
  ('hotdeals_heading', 'Mira nuestros paquetes mejor calificados', 'homepage_ofertas', 'Título', 'text'),
  ('hotdeals_price_label', 'por pareja', 'homepage_ofertas', 'Etiqueta de precio', 'text')
ON CONFLICT (key) DO NOTHING;

-- Homepage Why Choose Us
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('why_tag', 'Por qué elegirnos', 'homepage_porque', 'Etiqueta', 'text'),
  ('why_heading', 'Tu Viaje en las Mejores Manos', 'homepage_porque', 'Título', 'text'),
  ('why_description', 'Somos la agencia con más de 20 años de experiencia que cuenta con IATA y que nos adaptamos a tu estilo y presupuesto', 'homepage_porque', 'Descripción', 'textarea'),
  ('why_pillars', '[{"icon":"Wallet","title":"Aventuras a tu Alcance","description":"Explora el mundo de forma asequible con Viaja Agencia."},{"icon":"Globe","title":"Destinos sin Límites, Memorias Infinitas","description":"Con Viaja Agencia el mundo te pertenece."},{"icon":"Headphones","title":"Servicio Excepcional, En Cada Paso del Camino","description":"Nuestro equipo especializado te brinda un servicio profesional de inicio a fin."},{"icon":"Map","title":"Tus Viajes de Ensueño, Nuestra Experiencia","description":"Confía en los expertos de Viaja Agencia."}]', 'homepage_porque', 'Pilares (JSON)', 'json')
ON CONFLICT (key) DO NOTHING;

-- Homepage Destinations
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('destinations_tag', 'Destinos', 'homepage_destinos', 'Etiqueta', 'text'),
  ('destinations_heading', 'Destinos para Todos los Gustos', 'homepage_destinos', 'Título', 'text'),
  ('destinations_description', '12 regiones del mundo esperan por ti', 'homepage_destinos', 'Descripción', 'text')
ON CONFLICT (key) DO NOTHING;

-- Homepage Testimonials
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('testimonials_tag', 'Testimonios', 'homepage_testimonios', 'Etiqueta', 'text'),
  ('testimonials_heading', 'Lo Que Dicen Nuestros Viajeros', 'homepage_testimonios', 'Título', 'text')
ON CONFLICT (key) DO NOTHING;

-- Homepage Newsletter
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('newsletter_tag', 'Newsletter', 'homepage_newsletter', 'Etiqueta', 'text'),
  ('newsletter_heading', '¡Mantente Informado con Nuestras Noticias!', 'homepage_newsletter', 'Título', 'text'),
  ('newsletter_description', 'Suscríbete a nuestro newsletter y sé el primero en conocer promociones exclusivas, destinos de temporada y las últimas novedades de Viaja Agencia.', 'homepage_newsletter', 'Descripción', 'textarea')
ON CONFLICT (key) DO NOTHING;

-- Homepage FAQ
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('faq_tag', 'Ayuda', 'homepage_faq', 'Etiqueta', 'text'),
  ('faq_heading', 'Preguntas Frecuentes', 'homepage_faq', 'Título', 'text')
ON CONFLICT (key) DO NOTHING;

-- Homepage Instagram
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('instagram_handle', 'viajaagencia', 'homepage_instagram', 'Handle de Instagram', 'text'),
  ('instagram_heading', 'Síguenos en Instagram', 'homepage_instagram', 'Título', 'text'),
  ('instagram_description', 'Inspírate con destinos increíbles, tips de viaje y las mejores promociones.', 'homepage_instagram', 'Descripción', 'textarea')
ON CONFLICT (key) DO NOTHING;

-- Page content keys (hero settings for each page)
INSERT INTO site_settings (key, value, category, label, field_type) VALUES
  ('paquetes_hero_image', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80', 'page_paquetes', 'Hero imagen', 'image'),
  ('paquetes_hero_tag', 'Paquetes Exclusivos', 'page_paquetes', 'Hero etiqueta', 'text'),
  ('paquetes_hero_heading', 'Viajes Inolvidables', 'page_paquetes', 'Hero título', 'text'),
  ('paquetes_hero_description', 'Paquetes diseñados con atención al detalle para que solo te preocupes por disfrutar.', 'page_paquetes', 'Hero descripción', 'textarea'),
  ('paquetes_megatravel_url', 'https://www.megatravel.com.mx/tools/ofertas-viaje.php?Dest=&txtColor=1D1D1D&lblTPaq=2667FF&lblTRange=062D97&lblNumRange=1DCEC8&itemBack=EFF4FF&ItemHov=062D97&txtColorHov=ffffff&ff=1', 'page_paquetes', 'Megatravel iframe URL', 'url'),
  ('eventos_hero_image', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80', 'page_eventos', 'Hero imagen', 'image'),
  ('eventos_hero_tag', 'Eventos Especiales', 'page_eventos', 'Hero etiqueta', 'text'),
  ('eventos_hero_heading', 'Momentos Extraordinarios', 'page_eventos', 'Hero título', 'text'),
  ('eventos_megatravel_url', 'https://www.megatravel.com.mx/tools/vi.php?Dest=12&txtColor=1D1D1D&lblTPaq=2667FF&lblTRange=062D97&lblNumRange=1DCEC8&itemBack=EFF4FF&ItemHov=062D97&txtColorHov=ffffff&ff=1', 'page_eventos', 'Megatravel iframe URL', 'url'),
  ('destinos_hero_image', 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80', 'page_destinos', 'Hero imagen', 'image'),
  ('destinos_hero_tag', 'Destinos Mundiales', 'page_destinos', 'Hero etiqueta', 'text'),
  ('destinos_hero_heading', 'Destinos para Todos los Gustos', 'page_destinos', 'Hero título', 'text'),
  ('nosotros_hero_image', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80', 'page_nosotros', 'Hero imagen', 'image'),
  ('nosotros_hero_tag', 'Viaja Agencia', 'page_nosotros', 'Hero etiqueta', 'text'),
  ('nosotros_hero_heading', 'Creamos Experiencias', 'page_nosotros', 'Hero título', 'text'),
  ('nosotros_stats', '[{"value":"20+","label":"Años de experiencia"},{"value":"10,000+","label":"Viajeros felices"},{"value":"50+","label":"Destinos mundiales"},{"value":"500+","label":"Vuelos gestionados al año"}]', 'page_nosotros', 'Estadísticas (JSON)', 'json'),
  ('contacto_hero_image', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80', 'page_contacto', 'Hero imagen', 'image'),
  ('contacto_hero_tag', 'Hablemos', 'page_contacto', 'Hero etiqueta', 'text'),
  ('contacto_hero_heading', 'Contáctanos', 'page_contacto', 'Hero título', 'text'),
  ('grupos_hero_image', 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1920&q=80', 'page_grupos', 'Hero imagen', 'image'),
  ('grupos_hero_tag', 'Viajes en Grupo', 'page_grupos', 'Hero etiqueta', 'text'),
  ('grupos_hero_heading', 'Aventuras Compartidas', 'page_grupos', 'Hero título', 'text'),
  ('hoteles_hero_image', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80', 'page_hoteles', 'Hero imagen', 'image'),
  ('hoteles_hero_tag', 'Hospedaje Premium', 'page_hoteles', 'Hero etiqueta', 'text'),
  ('hoteles_hero_heading', 'Los Mejores Hoteles del Mundo', 'page_hoteles', 'Hero título', 'text'),
  ('tours_hero_image', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1920&q=80', 'page_tours', 'Hero imagen', 'image'),
  ('tours_hero_tag', 'Tours y Excursiones', 'page_tours', 'Hero etiqueta', 'text'),
  ('tours_hero_heading', 'Experiencias Únicas', 'page_tours', 'Hero título', 'text'),
  ('autos_hero_image', 'https://images.unsplash.com/photo-1449965408869-ebd3fee6b5e7?w=1920&q=80', 'page_autos', 'Hero imagen', 'image'),
  ('autos_hero_tag', 'Renta de Autos', 'page_autos', 'Hero etiqueta', 'text'),
  ('autos_hero_heading', 'Tu Auto en Cualquier Destino', 'page_autos', 'Hero título', 'text')
ON CONFLICT (key) DO NOTHING;
