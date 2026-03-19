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
  HotelbedsRoom,
  HotelbedsRate,
  HotelbedsBookingRequest,
  HotelbedsBookingConfirmation,
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
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
  };
}

// ---------------------------------------------------------------------------
// Destination code lookup — shared module
// ---------------------------------------------------------------------------

import { resolveDestinationCode } from "@/lib/data/destination-codes";

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
function normalizeRooms(rawRooms: any[]): HotelbedsRoom[] {
  return rawRooms.map((room) => ({
    code: room.code ?? "",
    name: room.name ?? "",
    rates: (room.rates ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any): HotelbedsRate => ({
        rateKey: r.rateKey ?? "",
        rateType: r.rateType === "BOOKABLE" ? "BOOKABLE" : "RECHECK",
        net: parseFloat(r.net ?? "0"),
        boardCode: r.boardCode ?? "",
        boardName: r.boardName ?? "",
        rooms: r.rooms ?? 1,
        adults: r.adults ?? 2,
        children: r.children ?? 0,
        cancellationPolicies: (r.cancellationPolicies ?? []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) => ({ amount: p.amount ?? "0", from: p.from ?? "" })
        ),
      })
    ),
  }));
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
    hotelCode: h.code,
    hotelRooms: h.rooms ? normalizeRooms(h.rooms) : undefined,
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
    filter: { maxHotels: 40 },
  };

  // Hotelbeds destination codes are uppercase IATA-style strings (e.g. "CUN", "BCN")
  // or numeric zone codes. Free-text is resolved via the lookup table.
  if (params.destination) {
    const dest = params.destination.trim();
    if (/^[A-Z]{3}$/.test(dest) || /^\d+$/.test(dest)) {
      // Already a valid IATA/zone code — use directly
      body.destination = { code: dest };
    } else {
      // Resolve free-text to a Hotelbeds destination code
      const code = resolveDestinationCode(dest);
      if (code) {
        body.destination = { code };
      } else {
        // Unknown destination — return empty so the UI can show a "no results" state
        // rather than silently serving unrelated mock hotels
        console.warn("[Hotelbeds] Could not resolve destination code for:", dest);
        return [];
      }
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
      return [];
    }

    const data = await res.json();
    const hotels = data.hotels?.hotels ?? [];

    if (hotels.length === 0) {
      console.warn("[Hotelbeds] No results for destination:", params.destination);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return hotels.map((h: any) => normalizeHotel(h));
  } catch (error) {
    console.error("[Hotelbeds] Search failed:", error);
    return [];
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

  void bookingId;
  return {
    confirmationId: bookingId,
    status: "cancelled",
    provider: "hotelbeds",
  };
}

// ---------------------------------------------------------------------------
// Hotelbeds Booking API — CheckRate / Book / Details / Cancel
// ---------------------------------------------------------------------------

export async function checkRate(
  rateKey: string
): Promise<HotelbedsRate | null> {
  if (!isLive()) {
    return {
      rateKey,
      rateType: "BOOKABLE",
      net: 0,
      boardCode: "BB",
      boardName: "Bed and Breakfast",
      rooms: 1,
      adults: 2,
      children: 0,
      cancellationPolicies: [],
    };
  }

  const config = await getConfig();
  const signature = await generateSignature(config);
  const headers = buildHeaders(config, signature);

  try {
    const res = await fetch(`${config.baseUrl}/checkrates`, {
      method: "POST",
      headers,
      body: JSON.stringify({ rooms: [{ rateKey }] }),
    });

    if (!res.ok) {
      console.error("[Hotelbeds] CheckRate error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const room = data.hotels?.rooms?.[0];
    const rate = room?.rates?.[0];
    if (!rate) return null;

    return {
      rateKey: rate.rateKey,
      rateType: rate.rateType === "BOOKABLE" ? "BOOKABLE" : "RECHECK",
      net: parseFloat(rate.net ?? "0"),
      boardCode: rate.boardCode ?? "",
      boardName: rate.boardName ?? "",
      rooms: rate.rooms ?? 1,
      adults: rate.adults ?? 2,
      children: rate.children ?? 0,
      cancellationPolicies: (rate.cancellationPolicies ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => ({ amount: p.amount ?? "0", from: p.from ?? "" })
      ),
    };
  } catch (error) {
    console.error("[Hotelbeds] CheckRate failed:", error);
    return null;
  }
}

export async function createHotelbedsBooking(
  req: HotelbedsBookingRequest
): Promise<HotelbedsBookingConfirmation> {
  if (!isLive()) {
    return {
      reference: `HB-MOCK-${Date.now()}`,
      status: "CONFIRMED",
      totalNet: req.rooms.length * 1000,
      currency: "EUR",
      hotelName: "Hotel de Prueba",
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      holder: req.holder,
    };
  }

  const config = await getConfig();
  const signature = await generateSignature(config);
  const headers = buildHeaders(config, signature);

  const body = {
    holder: req.holder,
    rooms: req.rooms,
    clientReference: req.clientReference,
    remark: req.remark,
    tolerance: req.tolerance ?? 2,
  };

  const res = await fetch(`${config.baseUrl}/bookings`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    const msg = data.error?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const booking = data.booking;
  const hotel = booking?.hotel;
  const firstRate = hotel?.rooms?.[0]?.rates?.[0];
  const policies = firstRate?.cancellationPolicies ?? [];

  return {
    reference: booking?.reference ?? "",
    status: booking?.status ?? "ON_REQUEST",
    totalNet: parseFloat(booking?.totalNet ?? "0"),
    currency: booking?.currency ?? "EUR",
    hotelName: hotel?.name ?? "",
    checkIn: hotel?.checkIn ?? "",
    checkOut: hotel?.checkOut ?? "",
    holder: booking?.holder ?? req.holder,
    cancellationAmount: policies[0]?.amount,
    cancellationFrom: policies[0]?.from,
  };
}

export async function getHotelbedsBooking(
  reference: string
): Promise<HotelbedsBookingConfirmation | null> {
  if (!isLive()) return null;

  const config = await getConfig();
  const signature = await generateSignature(config);
  const headers = buildHeaders(config, signature);

  try {
    const res = await fetch(`${config.baseUrl}/bookings/${reference}`, {
      headers,
    });

    if (!res.ok) {
      console.error("[Hotelbeds] GetBooking error:", res.status);
      return null;
    }

    const data = await res.json();
    const booking = data.booking;
    const hotel = booking?.hotel;
    const firstRate = hotel?.rooms?.[0]?.rates?.[0];
    const policies = firstRate?.cancellationPolicies ?? [];

    return {
      reference: booking?.reference ?? reference,
      status: booking?.status ?? "ON_REQUEST",
      totalNet: parseFloat(booking?.totalNet ?? "0"),
      currency: booking?.currency ?? "EUR",
      hotelName: hotel?.name ?? "",
      checkIn: hotel?.checkIn ?? "",
      checkOut: hotel?.checkOut ?? "",
      holder: booking?.holder,
      cancellationAmount: policies[0]?.amount,
      cancellationFrom: policies[0]?.from,
    };
  } catch (error) {
    console.error("[Hotelbeds] GetBooking failed:", error);
    return null;
  }
}

export async function cancelHotelbedsBooking(
  reference: string
): Promise<HotelbedsBookingConfirmation | null> {
  if (!isLive()) {
    return {
      reference,
      status: "CANCELLED",
      totalNet: 0,
      currency: "EUR",
      hotelName: "",
      checkIn: "",
      checkOut: "",
      holder: { name: "", surname: "" },
    };
  }

  const config = await getConfig();
  const signature = await generateSignature(config);
  const headers = buildHeaders(config, signature);

  try {
    const res = await fetch(
      `${config.baseUrl}/bookings/${reference}?cancellationFlag=CANCELLATION`,
      { method: "DELETE", headers }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Hotelbeds] CancelBooking error:", res.status, errText);
      return null;
    }

    const data = await res.json();
    const booking = data.booking;

    return {
      reference: booking?.reference ?? reference,
      status: "CANCELLED",
      totalNet: parseFloat(booking?.totalNet ?? "0"),
      currency: booking?.currency ?? "EUR",
      hotelName: booking?.hotel?.name ?? "",
      checkIn: booking?.hotel?.checkIn ?? "",
      checkOut: booking?.hotel?.checkOut ?? "",
      holder: booking?.holder ?? { name: "", surname: "" },
    };
  } catch (error) {
    console.error("[Hotelbeds] CancelBooking failed:", error);
    return null;
  }
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
