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

const USE_LIVE_HOTELBEDS = process.env.USE_LIVE_HOTELBEDS === "true";

function getConfig(): HotelbedsConfig {
  return {
    apiKey: process.env.HOTELBEDS_API_KEY ?? "",
    secret: process.env.HOTELBEDS_SECRET ?? "",
    baseUrl:
      process.env.HOTELBEDS_BASE_URL ??
      "https://api.test.hotelbeds.com/hotel-api/1.0",
  };
}

async function generateSignature(): Promise<string> {
  const { apiKey, secret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const raw = apiKey + secret + timestamp;

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildHeaders(signature: string): Record<string, string> {
  const { apiKey } = getConfig();
  return {
    "Api-key": apiKey,
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
// Public API
// ---------------------------------------------------------------------------

export async function searchHotels(
  params: SearchParams
): Promise<NormalizedHotel[]> {
  if (!USE_LIVE_HOTELBEDS) {
    return mockHotels();
  }

  // TODO: Implement live Hotelbeds availability search
  // POST {baseUrl}/hotels
  // Body: { stay: { checkIn, checkOut }, occupancies: [{ rooms, adults, children }], destination: { code } }
  const signature = await generateSignature();
  const { baseUrl } = getConfig();
  const _headers = buildHeaders(signature);

  const _body = {
    stay: { checkIn: params.checkIn, checkOut: params.checkOut },
    occupancies: [
      { rooms: params.rooms, adults: params.guests, children: 0 },
    ],
    destination: { code: params.destination },
  };

  // const res = await fetch(`${baseUrl}/hotels`, { method: "POST", headers: _headers, body: JSON.stringify(_body) });
  // const data = await res.json();
  // return normalizeHotelbedsResults(data);

  void baseUrl;
  return mockHotels();
}

export async function getHotelDetails(
  hotelId: string
): Promise<NormalizedHotel | null> {
  if (!USE_LIVE_HOTELBEDS) {
    return mockHotels().find((h) => h.id === hotelId) ?? null;
  }

  // TODO: Implement live hotel details fetch
  // GET {baseUrl}/hotels/{hotelId}/details
  const signature = await generateSignature();
  const { baseUrl } = getConfig();
  const _headers = buildHeaders(signature);

  void baseUrl;
  void signature;
  return mockHotels().find((h) => h.id === hotelId) ?? null;
}

export async function createBooking(
  params: BookingParams
): Promise<BookingResult> {
  if (!USE_LIVE_HOTELBEDS) {
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
  // Body: { holder, rooms, clientReference, remark }
  const signature = await generateSignature();
  const { baseUrl } = getConfig();
  const _headers = buildHeaders(signature);

  void baseUrl;
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
  if (!USE_LIVE_HOTELBEDS) {
    return {
      confirmationId: bookingId,
      status: "cancelled",
      provider: "hotelbeds",
    };
  }

  // TODO: Implement live Hotelbeds booking cancellation
  // DELETE {baseUrl}/bookings/{bookingId}
  const signature = await generateSignature();
  const { baseUrl } = getConfig();
  const _headers = buildHeaders(signature);

  void baseUrl;
  return {
    confirmationId: bookingId,
    status: "cancelled",
    provider: "hotelbeds",
  };
}

export async function searchActivities(
  params: TourSearchParams
): Promise<NormalizedTour[]> {
  if (!USE_LIVE_HOTELBEDS) {
    return mockTours();
  }

  // TODO: Implement live Hotelbeds activities search
  // POST {baseUrl}/activities/availability
  const signature = await generateSignature();
  const { baseUrl } = getConfig();
  const _headers = buildHeaders(signature);

  void baseUrl;
  void params;
  return mockTours();
}

export async function searchTransfers(
  params: TransferSearchParams
): Promise<NormalizedCar[]> {
  if (!USE_LIVE_HOTELBEDS) {
    return mockTransfers();
  }

  // TODO: Implement live Hotelbeds transfers search
  // POST {baseUrl}/transfers/availability
  const signature = await generateSignature();
  const { baseUrl } = getConfig();
  const _headers = buildHeaders(signature);

  void baseUrl;
  void params;
  return mockTransfers();
}
