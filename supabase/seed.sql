-- Seed data for Viaja Agencia
-- Run after migrations

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('company_name', 'Viaja Agencia'),
  ('legal_name', 'Grupo Turístico del Centro-Occidente, S.A. de C.V.'),
  ('address', 'Nube #522, Col. Jardines del Moral, C.P. 37160, León, Gto., México'),
  ('phone', '477 779 0610 ext 102 al 115'),
  ('email', 'info@viajaagencia.com.mx'),
  ('whatsapp', '+524777790610'),
  ('facebook', 'https://facebook.com/viajaagencia'),
  ('instagram', 'https://instagram.com/viajaagencia'),
  ('years_experience', '20')
ON CONFLICT (key) DO NOTHING;

-- Destinations (12 regions)
INSERT INTO destinations (name, region, description, display_order) VALUES
  ('Europa', 'Europa', 'Descubre la magia del viejo continente: historia, cultura, gastronomía y paisajes inolvidables desde las costas del Mediterráneo hasta los fiordos nórdicos.', 1),
  ('Medio Oriente', 'Medio Oriente', 'Sumérgete en un mundo de contrastes fascinantes: desiertos dorados, ciudades futuristas y tradiciones milenarias que te dejarán sin aliento.', 2),
  ('Asia', 'Asia', 'Desde templos ancestrales hasta metrópolis vibrantes, Asia te ofrece una experiencia sensorial completa con sabores, colores y sonidos únicos.', 3),
  ('Pacífico', 'Pacífico', 'Islas paradisíacas, aguas cristalinas y atardeceres de ensueño. El Pacífico es el destino perfecto para reconectar con la naturaleza.', 4),
  ('África', 'África', 'Safaris épicos, culturas vibrantes y paisajes que van desde el Sahara hasta las cataratas Victoria. África es aventura en estado puro.', 5),
  ('Sudamérica', 'Sudamérica', 'Desde Machu Picchu hasta la Patagonia, Sudamérica combina maravillas naturales con una cultura rica y gastronomía excepcional.', 6),
  ('Centroamérica', 'Centroamérica', 'Playas caribeñas, ruinas mayas, volcanes activos y una biodiversidad increíble te esperan en el corazón de las Américas.', 7),
  ('Cuba y el Caribe', 'Caribe', 'Sol, arena blanca, aguas turquesa y ritmos tropicales. El Caribe es sinónimo de relajación y alegría pura.', 8),
  ('Estados Unidos', 'Norteamérica', 'Desde Nueva York hasta Los Ángeles, parques nacionales épicos y ciudades icónicas. La diversidad de experiencias es infinita.', 9),
  ('Canadá', 'Norteamérica', 'Naturaleza salvaje, ciudades cosmopolitas y las auroras boreales. Canadá ofrece experiencias únicas en cada estación del año.', 10),
  ('México', 'México', 'Nuestro hermoso país: playas paradisíacas, sitios arqueológicos, ciudades coloniales y la mejor gastronomía del mundo.', 11),
  ('Cruceros', 'Cruceros', 'Navega por los mares del mundo con todo incluido. Lujo, entretenimiento y múltiples destinos en un solo viaje.', 12)
ON CONFLICT DO NOTHING;

-- Promotions (Ofertas HOT)
INSERT INTO promotions (title, description, destination, price_usd, badge, image_url) VALUES
  ('Grecia Clásica', 'Atenas, Santorini y Mykonos. 8 días todo incluido con vuelos, hoteles boutique y tours privados por las islas más icónicas del Egeo.', 'Grecia', 7500, 'HOT', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80'),
  ('Italia Romántica', 'Roma, Florencia y Venecia. 7 días recorriendo la cuna del Renacimiento con guías expertos, cenas gourmet y alojamiento premium.', 'Italia', 5500, NULL, 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80'),
  ('París de Ensueño', 'La Ciudad Luz como nunca la has vivido. 8 días con hotel boutique en Le Marais, crucero por el Sena y experiencias gastronómicas exclusivas.', 'París', 7500, 'HOT', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'),
  ('Maldivas Luxury', 'El paraíso existe. 7 días en villa sobre el agua con todo incluido, snorkel, spa y cenas privadas en la playa.', 'Maldivas', 7500, 'Premium', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80'),
  ('Marruecos Mágico', 'Marrakech, Fez y el desierto del Sahara. 8 días de inmersión cultural con riads de lujo, paseos en camello y cenas bajo las estrellas.', 'Marruecos', 5500, NULL, 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80'),
  ('Japón Imperial', 'Tokio, Kioto y Osaka. 10 días descubriendo la perfecta armonía entre tradición milenaria y tecnología de vanguardia.', 'Japón', 7500, 'HOT', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80')
ON CONFLICT DO NOTHING;

-- FAQ
INSERT INTO faq (question, answer, display_order) VALUES
  ('¿Cómo puedo comenzar a planificar mi viaje con Viaja Agencia?', 'Es muy sencillo. Puedes contactarnos por teléfono al 477 779 0610, por WhatsApp, por correo electrónico a info@viajaagencia.com.mx o visitarnos en nuestras oficinas en León, Guanajuato. Uno de nuestros asesores te atenderá de forma personalizada para diseñar el viaje perfecto para ti.', 1),
  ('¿En qué destinos se especializan?', 'Contamos con más de 20 años de experiencia ofreciendo viajes a todo el mundo. Nos especializamos en Europa, Asia, Medio Oriente, el Caribe y destinos nacionales. Trabajamos con los mejores proveedores internacionales para garantizar calidad y precio.', 2),
  ('¿Pueden ayudarme con viajes grupales?', 'Por supuesto. Organizamos viajes grupales para familias, amigos, empresas y grupos especiales. Manejamos toda la logística: vuelos, hospedaje, tours y actividades, asegurándonos de que todos tengan una experiencia inolvidable.', 3),
  ('¿Qué medidas de seguridad tienen durante el viaje?', 'Trabajamos únicamente con proveedores certificados y seguros de viaje internacionales. Además, ofrecemos asistencia 24/7 durante tu viaje para cualquier emergencia o imprevisto. Tu seguridad es nuestra prioridad número uno.', 4),
  ('¿Qué tipo de soporte ofrecen durante el viaje?', 'Ofrecemos soporte 24/7 durante todo tu viaje. Puedes contactarnos por teléfono, WhatsApp o correo electrónico en cualquier momento. Nuestro equipo está preparado para ayudarte con cualquier situación.', 5),
  ('¿Puedo modificar mis planes de viaje una vez confirmados?', 'Entendemos que los planes pueden cambiar. Trabajamos contigo para hacer las modificaciones necesarias sujetas a las políticas de cambio de cada proveedor. Te recomendamos contratar nuestro seguro de viaje que incluye protección ante cambios e imprevistos.', 6)
ON CONFLICT DO NOTHING;
