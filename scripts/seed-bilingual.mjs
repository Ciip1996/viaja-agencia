#!/usr/bin/env node
/**
 * Bilingual seed script — adds English translations for all existing Spanish content.
 * Uses the Supabase REST API with the service-role key.
 *
 * Usage: node scripts/seed-bilingual.mjs
 */

import { randomUUID } from "crypto";
import { config } from "dotenv";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function rest(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: { ...headers, ...(opts.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${path}: ${text}`);
  return text ? JSON.parse(text) : null;
}

async function fetchAll(table) {
  try {
    return await rest(`/${table}?locale=eq.es&order=created_at.asc&limit=100`);
  } catch {
    return rest(`/${table}?locale=eq.es&limit=100`);
  }
}

async function upsert(table, rows) {
  if (!rows.length) return;
  return rest(`/${table}`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(rows),
  });
}

async function patch(table, id, data) {
  return rest(`/${table}?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/* ── Translation maps ────────────────────────────────────── */

const PROMO_EN = {
  "Italia Romántica": {
    title: "Romantic Italy",
    description:
      "Rome, Florence and Venice. 7 days exploring the cradle of the Renaissance with expert guides, gourmet dinners and premium accommodation.",
  },
  "Japón Imperial": {
    title: "Imperial Japan",
    description:
      "Discover Tokyo, Kyoto and Osaka. An 8-day immersive journey through temples, neon cities and exceptional cuisine.",
  },
  "Maldivas All-Inclusive": {
    title: "Maldives All-Inclusive",
    description:
      "5-night overwater villa stay with full board, spa treatments and water activities in paradise.",
  },
  "Cancún Aventura": {
    title: "Cancún Adventure",
    description:
      "Explore the Riviera Maya: snorkel in cenotes, visit Chichén Itzá and relax on white-sand beaches. 6-day package.",
  },
  "Safari en Kenia": {
    title: "Kenya Safari",
    description:
      "7 days on safari in the Masai Mara. Track the Big Five, visit Maasai villages and enjoy luxury lodges.",
  },
  "París de Ensueño": {
    title: "Dreamy Paris",
    description:
      "5 nights in the City of Light: Eiffel Tower, Louvre, Montmartre and Seine river cruise. Boutique hotel in Le Marais.",
  },
  "Maldivas Luxury": {
    title: "Maldives Luxury",
    description:
      "5-night stay in an overwater villa with full board, private spa and water activities in paradise.",
  },
  "Marruecos Mágico": {
    title: "Magical Morocco",
    description:
      "Explore Marrakech, Fez and the Sahara Desert. 8 days of vibrant souks, riads and camel rides under the stars.",
  },
  "Grecia Clásica": {
    title: "Classical Greece",
    description:
      "Athens, Santorini and Mykonos. 9 days of ancient ruins, azure seas and Mediterranean cuisine.",
  },
};

const PKG_EN = {
  "Europa Express": {
    title: "Europe Express",
    description:
      "Visit 5 European capitals in 14 days: Madrid, Paris, Rome, Berlin and Amsterdam. Internal flights, 4-star hotels and guided tours.",
    difficulty: "Moderate",
    includes: "Flights, 4★ hotels, guided tours, insurance",
    excludes: "Unspecified meals, tips",
    itinerary_summary:
      "Day 1-3: Madrid · Day 4-6: Paris · Day 7-9: Rome · Day 10-11: Berlin · Day 12-14: Amsterdam",
  },
  "Asia Milenaria": {
    title: "Ancient Asia",
    description:
      "An unforgettable 12-day journey through Japan, Thailand and Vietnam. From temples to floating markets, an immersive cultural experience.",
    difficulty: "Moderate",
    includes: "Flights, 4★ hotels, local guides, transport",
    excludes: "Some meals, personal expenses",
    itinerary_summary:
      "Day 1-4: Tokyo & Kyoto · Day 5-8: Bangkok & Chiang Mai · Day 9-12: Hanoi & Ha Long Bay",
  },
  "Caribe Total": {
    title: "Total Caribbean",
    description:
      "7-night all-inclusive stay at a luxury resort in the Riviera Maya. Beaches, pools, gourmet restaurants and exciting excursions.",
    difficulty: "Easy",
    includes: "All-inclusive resort, airport transfers",
    excludes: "Flights, optional excursions",
    itinerary_summary:
      "Day 1-3: Relax at resort · Day 4: Xcaret · Day 5: Cenote tour · Day 6-7: Free day",
  },
  "Patagonia Extrema": {
    title: "Extreme Patagonia",
    description:
      "10-day adventure through Torres del Paine, Perito Moreno glacier and Ushuaia. For bold travelers seeking unforgettable landscapes.",
    difficulty: "High",
    includes: "Flights, camps and lodges, trekking guide",
    excludes: "Personal gear, travel insurance",
    itinerary_summary:
      "Day 1-4: Torres del Paine · Day 5-7: El Calafate · Day 8-10: Ushuaia",
  },
  "Tailandia Aventura": {
    title: "Thailand Adventure",
    description:
      "12 days exploring Bangkok, Chiang Mai and the islands of southern Thailand. Temples, street food and paradise beaches.",
    difficulty: "Moderate",
    includes: "Flights, hotels, guided tours, transfers",
    excludes: "Some meals, personal expenses",
    itinerary_summary:
      "Day 1-4: Bangkok · Day 5-8: Chiang Mai · Day 9-12: Koh Samui & Koh Phangan",
  },
  "Perú Ancestral": {
    title: "Ancestral Peru",
    description:
      "10 days through Lima, Cusco, Sacred Valley and Machu Picchu. Inca Trail trek, local gastronomy and colonial architecture.",
    difficulty: "Moderate-High",
    includes: "Flights, lodges, Inca Trail permits, bilingual guide",
    excludes: "Personal gear, tips",
    itinerary_summary:
      "Day 1-2: Lima · Day 3-5: Cusco & Sacred Valley · Day 6-8: Inca Trail · Day 9-10: Machu Picchu & return",
  },
  "Riviera Maya All-Inclusive": {
    title: "Riviera Maya All-Inclusive",
    description:
      "7-night all-inclusive stay at a luxury resort. White-sand beaches, cenotes, Xcaret and Mayan ruins.",
    difficulty: "Easy",
    includes: "All-inclusive resort, airport transfers, excursions",
    excludes: "Flights, personal expenses",
    itinerary_summary:
      "Day 1-3: Resort & beach · Day 4: Xcaret · Day 5: Cenotes · Day 6: Chichén Itzá · Day 7: Tulum",
  },
  "Safari Kenia & Tanzania": {
    title: "Kenya & Tanzania Safari",
    description:
      "10-day safari through the Serengeti, Ngorongoro Crater and Masai Mara. Luxury camps, Big Five and Maasai culture.",
    difficulty: "Moderate",
    includes: "Flights, safari lodges, game drives, park fees",
    excludes: "Visas, travel insurance, tips",
    itinerary_summary:
      "Day 1-3: Nairobi & Masai Mara · Day 4-6: Serengeti · Day 7-8: Ngorongoro · Day 9-10: Zanzibar (optional)",
  },
};

const DEST_EN = {
  "Medio Oriente": {
    name: "Middle East",
    description:
      "Immerse yourself in a world of fascinating contrasts: golden deserts, futuristic cities and ancient traditions.",
  },
  Europa: {
    name: "Europe",
    description:
      "From the Eiffel Tower to the canals of Venice, explore the rich history, art and gastronomy of the old continent.",
  },
  Asia: {
    name: "Asia",
    description:
      "From neon-lit Tokyo to the temples of Bali, discover an extraordinary mosaic of cultures, flavors and landscapes.",
  },
  "Riviera Maya": {
    name: "Riviera Maya",
    description:
      "Turquoise waters, cenotes, Mayan ruins and the finest all-inclusive resorts just a few hours from home.",
  },
  Sudamérica: {
    name: "South America",
    description:
      "Machu Picchu, Patagonia, Rio de Janeiro… a continent of adventure, nature and vibrant culture.",
  },
  África: {
    name: "Africa",
    description:
      "From the Serengeti savannas to Moroccan medinas, a continent that awakens all your senses.",
  },
  Pacífico: {
    name: "Pacific",
    description:
      "From the beaches of Australia to the islands of New Zealand and Fiji — endless blue horizons await.",
  },
  Centroamérica: {
    name: "Central America",
    description:
      "Discover Costa Rica's rainforests, Guatemala's Mayan heritage and Panama's vibrant culture.",
  },
  "Cuba y el Caribe": {
    name: "Cuba & The Caribbean",
    description:
      "Classic cars, salsa rhythms, turquoise waters and white sand across the Caribbean islands.",
  },
  "Estados Unidos": {
    name: "United States",
    description:
      "From New York's skyline to California's coastline — endless experiences in the land of diversity.",
  },
  Canadá: {
    name: "Canada",
    description:
      "Majestic national parks, cosmopolitan cities and the Northern Lights — nature at its finest.",
  },
  México: {
    name: "Mexico",
    description:
      "From the beaches of Cancún to the mountains of Oaxaca — explore the richness of your own country.",
  },
  Cruceros: {
    name: "Cruises",
    description:
      "Set sail on world-class cruise ships through the Caribbean, Mediterranean, Alaska and beyond.",
  },
};

const GROUP_EN = {
  "Tierra Santa — Semana Santa 2026": {
    title: "Holy Land — Easter 2026",
    description:
      "Group trip for Easter through Jerusalem, Bethlehem, the Dead Sea and Petra. A unique spiritual and cultural experience.",
  },
  "Japón: Tradición y Modernidad": {
    title: "Japan: Tradition and Modernity",
    description:
      "A 10-day journey through Tokyo, Kyoto and Osaka exploring both ancient Japanese tradition and cutting-edge technology.",
  },
  "Perú Ancestral": {
    title: "Ancestral Peru",
    description:
      "Explore Machu Picchu, Cusco and the Sacred Valley. Group trek with bilingual guide and premium lodges.",
  },
  "Crucero por el Mediterráneo — Verano 2026": {
    title: "Mediterranean Cruise — Summer 2026",
    description:
      "7-night group cruise through Barcelona, Marseille, Rome and the Greek Islands. All meals and entertainment included.",
  },
  "Egipto Milenario — Octubre 2026": {
    title: "Ancient Egypt — October 2026",
    description:
      "Explore the Pyramids of Giza, Luxor temples and a Nile cruise. Expert Egyptologist guide and 5-star hotels.",
  },
};

const EVENT_EN = {
  "Fórmula 1 — Gran Premio de México 2026": {
    title: "Formula 1 — Mexico Grand Prix 2026",
    description:
      "Experience the thrill of F1 at the Autódromo Hermanos Rodríguez. Package with tickets, hotel and transfers in Mexico City.",
  },
  "Oktoberfest Múnich 2026": {
    title: "Oktoberfest Munich 2026",
    description:
      "The world's most famous beer festival. Complete package: flights, hotel near the festival grounds and VIP tent reservations.",
  },
  "Expo Osaka 2026": {
    title: "Expo Osaka 2026",
    description:
      "Visit the World Expo in Osaka with a full package: tickets, hotel and tours of Kyoto and Nara included.",
  },
  "Año Nuevo en Nueva York 2027": {
    title: "New Year's Eve in New York 2027",
    description:
      "Ring in 2027 in Times Square. Package includes 4-night hotel, Broadway show tickets and city tours.",
  },
  "Carnaval de Río 2027": {
    title: "Rio Carnival 2027",
    description:
      "Experience the world's biggest party. VIP Sambadrome seats, beachfront hotel and guided city tours.",
  },
};

const BLOG_EN = {
  "10 Tips para Viajar a Europa por Primera Vez": {
    title: "10 Tips for Traveling to Europe for the First Time",
    slug: "tips-traveling-europe-first-time",
    excerpt:
      "Everything you need to know before your first trip to the old continent: from visas to budgeting.",
    content:
      '<h2>Your first trip to Europe</h2><p>Europe is one of the most dreamed-of destinations and for good reason. Here are the best tips to make your first experience unforgettable.</p><h3>1. Plan ahead</h3><p>Flights to Europe are usually cheaper if purchased 3-4 months in advance. Off-season (January-March, November) offers prices up to 40% lower.</p><h3>2. Travel insurance is essential</h3><p>For the Schengen area, you must have medical insurance with minimum coverage of EUR 30,000.</p>',
  },
  "Las Mejores Playas del Caribe Mexicano": {
    title: "The Best Beaches of the Mexican Caribbean",
    slug: "best-beaches-mexican-caribbean",
    excerpt:
      "Crystal-clear waters and white sand: discover the most beautiful hidden coves and beaches in the Riviera Maya and beyond.",
    content:
      '<h2>Caribbean paradise</h2><p>The Mexican Caribbean is home to some of the most spectacular beaches in the world. From the bustling shores of Cancún to the secluded coves of Tulum, each spot offers a unique experience.</p><h3>Top picks</h3><p>Playa del Carmen, Tulum Beach, Isla Mujeres, Holbox, and Bacalar Lagoon.</p>',
  },
  "Guía Completa: Japón para Viajeros Mexicanos": {
    title: "Complete Guide: Japan for Mexican Travelers",
    slug: "guide-japan-mexican-travelers",
    excerpt:
      "From visas to bullet trains: everything a Mexican traveler needs to know to explore the Land of the Rising Sun.",
    content:
      '<h2>Japan awaits</h2><p>Japan is a fascinating blend of ancient tradition and futuristic innovation. Here\'s your complete guide to planning the perfect trip from Mexico.</p><h3>Visa</h3><p>Mexican citizens need a tourist visa. Apply at the Embassy of Japan in Mexico City, processing takes about 5 business days.</p>',
  },
  "Los Mejores Destinos de Playa en México para 2026": {
    title: "Best Beach Destinations in Mexico for 2026",
    slug: "best-beach-destinations-mexico-2026",
    excerpt:
      "From Cancún to Los Cabos, discover the top beach destinations that Mexico has to offer this year.",
    content:
      "<h2>Sun, sand and sea</h2><p>Mexico boasts some of the world's most stunning beaches. Whether you're looking for all-inclusive luxury or off-the-beaten-path adventures, there's a perfect beach for everyone.</p><h3>Top picks</h3><p>Cancún, Los Cabos, Puerto Vallarta, Huatulco and Holbox.</p>",
  },
  "Guía Completa: Qué Empacar para un Viaje Internacional": {
    title: "Complete Guide: What to Pack for an International Trip",
    slug: "packing-guide-international-travel",
    excerpt:
      "The essential packing checklist so you never forget anything important on your next international adventure.",
    content:
      "<h2>Pack smart</h2><p>Packing for an international trip doesn't have to be stressful. Follow this guide to make sure you have everything you need.</p><h3>Essentials</h3><p>Passport, copies of documents, travel adapter, comfortable shoes, layers for different climates and a small first-aid kit.</p>",
  },
};

const FAQ_EN = [
  {
    match: "¿Cómo puedo comenzar a planificar mi viaje",
    question: "How can I start planning my trip with Viaja Agencia?",
    answer:
      "It's very easy. You can contact us by phone at 477 779 0610, by WhatsApp, by email at reservaciones@viajaagencia.com.mx, or visit us at our offices in León, Guanajuato.",
  },
  {
    match: "¿Los precios incluyen vuelos",
    question: "Do the prices include flights?",
    answer:
      "It depends on the package. Some include international flights, others only domestic. Each package detail page clearly specifies what's included and excluded.",
  },
  {
    match: "¿Necesito visa",
    question: "Do I need a visa for my trip?",
    answer:
      "It depends on the destination. Our team advises you on the specific requirements for each country: visas, passports, vaccinations, etc.",
  },
  {
    match: "¿Ofrecen planes de pago",
    question: "Do you offer payment plans?",
    answer:
      "Yes. We offer flexible payment plans with up to 12 monthly installments without interest with participating credit cards. We also accept bank transfers.",
  },
  {
    match: "¿Qué pasa si necesito cancelar",
    question: "What happens if I need to cancel my trip?",
    answer:
      "Each package has its own cancellation policy. We recommend purchasing travel insurance that covers cancellations. We will always look for the best solution for you.",
  },
  {
    match: "¿Tienen seguro de viaje",
    question: "Do you offer travel insurance?",
    answer:
      "Yes, we offer comprehensive travel insurance through our partners that covers medical emergencies, cancellations, lost luggage and more.",
  },
  {
    match: "¿En qué destinos se especializan",
    question: "What destinations do you specialize in?",
    answer:
      "We specialize in Europe, Asia, the Caribbean, South America and the Middle East, but we can organize trips to any destination in the world.",
  },
  {
    match: "¿Pueden ayudarme con viajes grupales",
    question: "Can you help me with group trips?",
    answer:
      "Absolutely. We organize group trips for families, friends, companies and special events. We handle all the logistics so you can enjoy the experience.",
  },
  {
    match: "¿Qué medidas de seguridad tienen durante",
    question: "What safety measures do you have during trips?",
    answer:
      "We work only with certified suppliers and include comprehensive travel insurance. Our team monitors your trip 24/7 and provides emergency support.",
  },
  {
    match: "¿Qué tipo de soporte ofrecen durante el",
    question: "What kind of support do you offer during the trip?",
    answer:
      "We provide 24/7 support via WhatsApp and phone. You'll also have a dedicated travel advisor available at all times during your trip.",
  },
  {
    match: "¿Puedo modificar mis planes de viaje una",
    question: "Can I modify my travel plans once booked?",
    answer:
      "Yes, subject to availability and supplier policies. We always work to find the best solution and minimize any change fees.",
  },
];

/* ── Site settings (duplicate feature flags + CMS for EN locale) ── */

async function seedSiteSettingsEN() {
  console.log("⏳ Duplicating site_settings for locale=en...");
  const esRows = await rest("/site_settings?locale=eq.es&limit=500");
  const enRows = esRows.map((row) => ({
    ...row,
    locale: "en",
  }));
  delete enRows.forEach?.call; // no-op, just ensuring it's an array
  for (const r of enRows) delete r.updated_at;

  await upsert("site_settings", enRows);
  console.log(`  ✅ ${enRows.length} site_settings rows duplicated for EN`);
}

/* ── Generic bilingual seeder ── */

async function seedTranslations(table, translationMap, nameKey = "title") {
  console.log(`⏳ Seeding EN translations for ${table}...`);
  const esRows = await fetchAll(table);
  let count = 0;

  for (const row of esRows) {
    const key = row[nameKey];
    const enData = translationMap[key];
    if (!enData) {
      console.log(`  ⚠️  No EN translation for "${key}" — skipping`);
      continue;
    }

    const groupId = row.translation_group_id || randomUUID();

    if (!row.translation_group_id) {
      await patch(table, row.id, { translation_group_id: groupId });
    }

    const enRow = { ...row };
    delete enRow.id;
    delete enRow.created_at;
    Object.assign(enRow, enData, {
      locale: "en",
      translation_group_id: groupId,
    });

    try {
      await rest(`/${table}`, {
        method: "POST",
        body: JSON.stringify(enRow),
      });
      count++;
    } catch (e) {
      if (e.message.includes("409") || e.message.includes("duplicate")) {
        console.log(`  ℹ️  EN row for "${key}" already exists`);
      } else {
        throw e;
      }
    }
  }
  console.log(`  ✅ ${count} EN rows inserted into ${table}`);
}

async function seedFaqEN() {
  console.log("⏳ Seeding EN translations for faq...");
  const esRows = await fetchAll("faq");
  let count = 0;

  for (const row of esRows) {
    const match = FAQ_EN.find((f) => row.question.startsWith(f.match));
    if (!match) {
      console.log(`  ⚠️  No EN translation for FAQ "${row.question.slice(0, 40)}…"`);
      continue;
    }

    const groupId = row.translation_group_id || randomUUID();
    if (!row.translation_group_id) {
      await patch("faq", row.id, { translation_group_id: groupId });
    }

    const enRow = {
      question: match.question,
      answer: match.answer,
      display_order: row.display_order,
      is_active: row.is_active,
      locale: "en",
      translation_group_id: groupId,
    };

    try {
      await rest("/faq", { method: "POST", body: JSON.stringify(enRow) });
      count++;
    } catch (e) {
      if (e.message.includes("409") || e.message.includes("duplicate")) {
        console.log(`  ℹ️  EN FAQ already exists`);
      } else {
        throw e;
      }
    }
  }
  console.log(`  ✅ ${count} EN rows inserted into faq`);
}

/* ── Main ── */

async function main() {
  console.log("🌐 Starting bilingual seed...\n");

  await seedSiteSettingsEN();
  await seedTranslations("promotions", PROMO_EN, "title");
  await seedTranslations("packages", PKG_EN, "title");
  await seedTranslations("destinations", DEST_EN, "name");
  await seedTranslations("group_trips", GROUP_EN, "title");
  await seedTranslations("events", EVENT_EN, "title");
  await seedTranslations("blog_posts", BLOG_EN, "title");
  await seedFaqEN();

  console.log("\n🎉 Bilingual seed complete!");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
