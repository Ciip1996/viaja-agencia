import type {
  HotelbedsConfig,
  NormalizedHotel,
  NormalizedTour,
  SearchParams,
  TourSearchParams,
  TransferSearchParams,
  BookingParams,
  BookingResult,
  NormalizedCar,
} from "./types";

import { getApiKey } from "@/lib/cms/api-keys";

function isLive(): boolean {
  return process.env.USE_LIVE_HOTELBEDS === "true";
}

async function getConfig(): Promise<HotelbedsConfig> {
  const [apiKey, secret, baseUrl] = await Promise.all([
    getApiKey("hotelbeds_api_key"),
    getApiKey("hotelbeds_secret"),
    getApiKey("hotelbeds_base_url"),
  ]);
  return {
    apiKey,
    secret,
    baseUrl: baseUrl || "https://api.test.hotelbeds.com/hotel-api/1.0",
  };
}

async function generateSignature(config: HotelbedsConfig): Promise<string> {
  const { apiKey, secret } = config;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const raw = apiKey + secret + timestamp;

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildHeaders(config: HotelbedsConfig, signature: string): Record<string, string> {
  return {
    "Api-key": config.apiKey,
    "X-Signature": signature,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

// ---------------------------------------------------------------------------
// Mock data generators
// ---------------------------------------------------------------------------

function mockHotels(): NormalizedHotel[] {
  return [
    {
      id: "hb-1",
      name: "Hotel Riviera Maya Resort",
      location: "Cancun, Mexico",
      price: 3200,
      currency: "MXN",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      amenities: ["wifi", "pool", "spa", "restaurant", "gym"],
      provider: "hotelbeds",
    },
    {
      id: "hb-2",
      name: "Grand Hotel Barcelona",
      location: "Barcelona, Espana",
      price: 4500,
      currency: "MXN",
      rating: 4.6,
      imageUrl:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      amenities: ["wifi", "restaurant", "bar", "concierge"],
      provider: "hotelbeds",
    },
    {
      id: "hb-3",
      name: "Santorini Blue Suites",
      location: "Santorini, Grecia",
      price: 6800,
      currency: "MXN",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
      amenities: ["wifi", "pool", "spa", "ocean-view", "breakfast"],
      provider: "hotelbeds",
    },
  ];
}

function mockTours(): NormalizedTour[] {
  return [
    {
      id: "hbt-1",
      name: "Tour Chichen Itza Premium",
      destination: "Yucatan, Mexico",
      duration: 10,
      price: 2800,
      currency: "MXN",
      difficulty: "facil",
      imageUrl:
        "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80",
      description:
        "Visita guiada a la maravilla del mundo con cenote y almuerzo incluido.",
      provider: "hotelbeds",
    },
    {
      id: "hbt-2",
      name: "Ruta del Vino en Toscana",
      destination: "Toscana, Italia",
      duration: 8,
      price: 4200,
      currency: "MXN",
      difficulty: "facil",
      imageUrl:
        "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=800&q=80",
      description:
        "Degustacion de vinos, visita a vinedos y almuerzo gourmet en la campiña toscana.",
      provider: "hotelbeds",
    },
  ];
}

function mockTransfers(): NormalizedCar[] {
  return [
    {
      id: "hbtr-1",
      model: "Mercedes Vito",
      category: "sedan",
      pricePerDay: 1800,
      currency: "MXN",
      features: ["AC", "GPS", "automatico", "wifi"],
      imageUrl:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80",
      provider: "hotelbeds",
    },
  ];
}

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

// categoryCode is like "5EST", "4EST", "3EST" — extract leading digit
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeStars(h: any): number {
  const match = String(h.categoryCode ?? "").match(/^(\d)/);
  if (match) return parseInt(match[1], 10);
  // categoryGroupCode fallback: "HOTEL" → 3
  return 3;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeHotel(h: any): NormalizedHotel {
  const minRate = parseFloat(h.minRate || "0");
  const destName = h.destinationName ?? "";
  const zoneName = h.zoneName ?? "";
  const location = [destName, zoneName].filter(Boolean).join(", ");
  return {
    id: `hb-${h.code}`,
    name: h.name || "Hotel",
    location,
    price: minRate,
    currency: h.currency || "USD",
    rating: normalizeStars(h),
    imageUrl: `https://photos.hotelbeds.com/giata/bigger/${h.code}/${h.code}a.jpg`,
    amenities: extractAmenities(h),
    provider: "hotelbeds",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAmenities(h: any): string[] {
  const amenities: string[] = [];
  const rooms = h.rooms ?? [];
  for (const room of rooms) {
    const rates = room.rates ?? [];
    for (const rate of rates) {
      if (rate.boardCode === "BB") amenities.push("breakfast");
      if (rate.boardCode === "AI") amenities.push("all-inclusive");
    }
  }
  return [...new Set(["wifi", ...amenities])];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function searchHotels(
  params: SearchParams
): Promise<NormalizedHotel[]> {
  if (!isLive()) {
    return mockHotels();
  }

  const config = await getConfig();
  const signature = await generateSignature(config);
  const headers = buildHeaders(config, signature);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: Record<string, any> = {
    stay: { checkIn: params.checkIn, checkOut: params.checkOut },
    occupancies: [
      { rooms: params.rooms || 1, adults: params.guests || 2, children: 0 },
    ],
    filter: { maxHotels: 20 },
  };

  // Hotelbeds destination codes are uppercase IATA-style strings (e.g. "CUN", "BCN")
  // or numeric zone codes. Text strings use keywordSearchList instead.
  if (params.destination) {
    const dest = params.destination.trim();
    if (/^[A-Z]{3}$/.test(dest) || /^\d+$/.test(dest)) {
      // IATA airport/destination code or numeric zone code
      body.destination = { code: dest };
    } else {
      // Free-text — use keywordSearchList (supported in Hotel Content API style searches)
      body.keywordSearchList = [dest];
      body.keywordSearchLogic = "AND";
    }
  }

  try {
    const res = await fetch(`${config.baseUrl}/hotels`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Hotelbeds] Search error:", res.status, errText);
      return mockHotels();
    }

    const data = await res.json();
    const hotels = data.hotels?.hotels ?? [];

    if (hotels.length === 0) {
      console.warn("[Hotelbeds] No results for destination:", params.destination);
      return mockHotels();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return hotels.map((h: any) => normalizeHotel(h));
  } catch (error) {
    console.error("[Hotelbeds] Search failed:", error);
    return mockHotels();
  }
}

export async function getHotelDetails(
  hotelId: string
): Promise<NormalizedHotel | null> {
  return mockHotels().find((h) => h.id === hotelId) ?? null;
}

export async function createBooking(
  params: BookingParams
): Promise<BookingResult> {
  if (!isLive()) {
    return {
      confirmationId: `HB-MOCK-${Date.now()}`,
      status: "confirmed",
      provider: "hotelbeds",
      totalPrice: 5000,
      currency: "MXN",
    };
  }

  // TODO: Implement live Hotelbeds booking confirmation
  // POST {baseUrl}/bookings
  void params;
  return {
    confirmationId: `HB-${Date.now()}`,
    status: "pending",
    provider: "hotelbeds",
  };
}

export async function cancelBooking(
  bookingId: string
): Promise<BookingResult> {
  if (!isLive()) {
    return {
      confirmationId: bookingId,
      status: "cancelled",
      provider: "hotelbeds",
    };
  }

  // TODO: Implement live Hotelbeds booking cancellation
  // DELETE {baseUrl}/bookings/{bookingId}
  void bookingId;
  return {
    confirmationId: bookingId,
    status: "cancelled",
    provider: "hotelbeds",
  };
}

// TODO: Activities use a different base URL (activity-api) — needs separate config
export async function searchActivities(
  params: TourSearchParams
): Promise<NormalizedTour[]> {
  void params;
  return mockTours();
}

// TODO: Transfers use a different base URL (transfer-api) — needs separate config
export async function searchTransfers(
  params: TransferSearchParams
): Promise<NormalizedCar[]> {
  void params;
  return mockTransfers();
}
