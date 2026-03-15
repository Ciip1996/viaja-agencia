import type {
  JuniperConfig,
  NormalizedHotel,
  NormalizedTour,
  NormalizedCar,
  SearchParams,
  TourSearchParams,
  TransferSearchParams,
  BookingParams,
  BookingResult,
} from "./types";

const USE_LIVE_JUNIPER = process.env.USE_LIVE_JUNIPER === "true";

function getConfig(): JuniperConfig {
  return {
    apiKey: process.env.JUNIPER_API_KEY ?? "",
    secret: process.env.JUNIPER_SECRET ?? "",
    baseUrl:
      process.env.JUNIPER_BASE_URL ?? "https://xml-uat.bookingengine.es",
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildAuthHeaders(): Record<string, string> {
  const { apiKey, secret } = getConfig();
  return {
    "Content-Type": "application/xml",
    Authorization: `Basic ${btoa(`${apiKey}:${secret}`)}`,
  };
}

// ---------------------------------------------------------------------------
// Mock data generators
// ---------------------------------------------------------------------------

function mockHotels(): NormalizedHotel[] {
  return [
    {
      id: "jp-1",
      name: "Hotel Xcaret Arte",
      location: "Playa del Carmen, Mexico",
      price: 5500,
      currency: "MXN",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      amenities: ["wifi", "pool", "spa", "all-inclusive", "beach"],
      provider: "juniper",
    },
    {
      id: "jp-2",
      name: "Riad Palais Namaskar",
      location: "Marrakech, Marruecos",
      price: 4800,
      currency: "MXN",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      amenities: ["wifi", "pool", "spa", "restaurant", "garden"],
      provider: "juniper",
    },
    {
      id: "jp-3",
      name: "Tokyo Imperial Hotel",
      location: "Tokio, Japon",
      price: 7200,
      currency: "MXN",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80",
      amenities: ["wifi", "restaurant", "concierge", "gym", "business"],
      provider: "juniper",
    },
  ];
}

function mockTours(): NormalizedTour[] {
  return [
    {
      id: "jpt-1",
      name: "Safari Masai Mara",
      destination: "Kenia, Africa",
      duration: 12,
      price: 8500,
      currency: "MXN",
      difficulty: "moderado",
      imageUrl:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
      description:
        "Safari de dia completo en la reserva Masai Mara con guia profesional y almuerzo.",
      provider: "juniper",
    },
    {
      id: "jpt-2",
      name: "Templos de Kioto",
      destination: "Kioto, Japon",
      duration: 6,
      price: 3600,
      currency: "MXN",
      difficulty: "facil",
      imageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      description:
        "Recorrido guiado por los templos mas emblematicos de Kioto, incluyendo Fushimi Inari.",
      provider: "juniper",
    },
  ];
}

function mockTransfers(): NormalizedCar[] {
  return [
    {
      id: "jptr-1",
      model: "Toyota Camry",
      category: "sedan",
      pricePerDay: 1200,
      currency: "MXN",
      features: ["AC", "GPS", "automatico"],
      imageUrl:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80",
      provider: "juniper",
    },
  ];
}

// ---------------------------------------------------------------------------
// Step 1: Static data (destination/product codes)
// ---------------------------------------------------------------------------

export interface StaticDataResult {
  destinations: Array<{ code: string; name: string }>;
  productTypes: Array<{ code: string; name: string }>;
}

export async function getStaticData(): Promise<StaticDataResult> {
  if (!USE_LIVE_JUNIPER) {
    return {
      destinations: [
        { code: "CUN", name: "Cancun" },
        { code: "BCN", name: "Barcelona" },
        { code: "TYO", name: "Tokio" },
        { code: "PAR", name: "Paris" },
        { code: "ROM", name: "Roma" },
      ],
      productTypes: [
        { code: "HTL", name: "Hotel" },
        { code: "TRF", name: "Transfer" },
        { code: "ACT", name: "Actividad" },
      ],
    };
  }

  // TODO: Implement live Juniper static data fetch
  // POST {baseUrl}/AvailStaticDataRQ (XML envelope with credentials)
  return { destinations: [], productTypes: [] };
}

// ---------------------------------------------------------------------------
// Step 2: Search availability
// ---------------------------------------------------------------------------

export async function searchAvailability(
  params: SearchParams
): Promise<NormalizedHotel[]> {
  if (!USE_LIVE_JUNIPER) {
    return mockHotels();
  }

  // TODO: Implement live Juniper availability search
  // POST {baseUrl}/HotelAvailRQ
  void params;
  return mockHotels();
}

export async function searchTours(
  params: TourSearchParams
): Promise<NormalizedTour[]> {
  if (!USE_LIVE_JUNIPER) {
    return mockTours();
  }

  // TODO: Implement live Juniper activity search
  // POST {baseUrl}/ActivityAvailRQ
  void params;
  return mockTours();
}

export async function searchTransfers(
  params: TransferSearchParams
): Promise<NormalizedCar[]> {
  if (!USE_LIVE_JUNIPER) {
    return mockTransfers();
  }

  // TODO: Implement live Juniper transfer search
  // POST {baseUrl}/TransferAvailRQ
  void params;
  return mockTransfers();
}

// ---------------------------------------------------------------------------
// Step 3: Rate check / valuation
// ---------------------------------------------------------------------------

export interface RateCheckResult {
  ratePlanCode: string;
  totalPrice: number;
  currency: string;
  cancellationPolicy: string;
  available: boolean;
}

export async function checkRate(
  ratePlanCode: string
): Promise<RateCheckResult> {
  if (!USE_LIVE_JUNIPER) {
    return {
      ratePlanCode,
      totalPrice: 4500,
      currency: "MXN",
      cancellationPolicy: "Cancelacion gratuita hasta 48h antes",
      available: true,
    };
  }

  // TODO: Implement live Juniper rate check
  // POST {baseUrl}/HotelValuationRQ
  return {
    ratePlanCode,
    totalPrice: 0,
    currency: "MXN",
    cancellationPolicy: "",
    available: false,
  };
}

// ---------------------------------------------------------------------------
// Step 4: Confirm booking
// ---------------------------------------------------------------------------

export async function confirmBooking(
  params: BookingParams
): Promise<BookingResult> {
  if (!USE_LIVE_JUNIPER) {
    return {
      confirmationId: `JP-MOCK-${Date.now()}`,
      status: "confirmed",
      provider: "juniper",
      totalPrice: 4500,
      currency: "MXN",
    };
  }

  // TODO: Implement live Juniper booking confirmation
  // POST {baseUrl}/HotelBookingRQ
  void params;
  return {
    confirmationId: `JP-${Date.now()}`,
    status: "pending",
    provider: "juniper",
  };
}
