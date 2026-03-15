import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/cms/api-keys", () => ({
  getApiKey: vi.fn((key: string) => {
    const map: Record<string, string> = {
      hotelbeds_api_key: "test-api-key",
      hotelbeds_secret: "test-secret",
      hotelbeds_base_url: "https://api.test.hotelbeds.com/hotel-api/1.0",
    };
    return Promise.resolve(map[key] ?? "");
  }),
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("searchHotels", () => {
  it("returns mock hotels when USE_LIVE_HOTELBEDS is false", async () => {
    vi.stubEnv("USE_LIVE_HOTELBEDS", "false");
    const { searchHotels } = await import("@/lib/services/hotelbeds");
    const results = await searchHotels({
      destination: "cancun",
      checkIn: "2025-06-01",
      checkOut: "2025-06-07",
      rooms: 1,
      guests: 2,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("id");
    expect(results[0]).toHaveProperty("name");
    expect(results[0]).toHaveProperty("price");
    expect(results[0]).toHaveProperty("provider", "hotelbeds");
  });

  it("mock hotels have required fields", async () => {
    vi.stubEnv("USE_LIVE_HOTELBEDS", "false");
    const { searchHotels } = await import("@/lib/services/hotelbeds");
    const results = await searchHotels({
      destination: "test",
      checkIn: "2025-01-01",
      checkOut: "2025-01-05",
      rooms: 1,
      guests: 2,
    });

    for (const hotel of results) {
      expect(hotel.id).toBeDefined();
      expect(hotel.name).toBeDefined();
      expect(typeof hotel.price).toBe("number");
      expect(hotel.currency).toBeDefined();
      expect(typeof hotel.rating).toBe("number");
      expect(hotel.provider).toBe("hotelbeds");
    }
  });
});

describe("searchActivities", () => {
  it("returns mock tours", async () => {
    const { searchActivities } = await import("@/lib/services/hotelbeds");
    const results = await searchActivities({
      destination: "mexico",
      date: "2025-06-01",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("id");
    expect(results[0]).toHaveProperty("name");
    expect(results[0]).toHaveProperty("provider", "hotelbeds");
  });
});

describe("searchTransfers", () => {
  it("returns mock cars", async () => {
    const { searchTransfers } = await import("@/lib/services/hotelbeds");
    const results = await searchTransfers({
      pickupLocation: "airport",
      dropoffLocation: "hotel",
      pickupDate: "2025-06-01",
      dropoffDate: "2025-06-07",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("id");
    expect(results[0]).toHaveProperty("model");
    expect(results[0]).toHaveProperty("provider", "hotelbeds");
  });
});

describe("createBooking", () => {
  it("returns mock booking when not live", async () => {
    vi.stubEnv("USE_LIVE_HOTELBEDS", "false");
    const { createBooking } = await import("@/lib/services/hotelbeds");
    const result = await createBooking({
      serviceId: "hb-1",
      serviceType: "hotel",
      checkIn: "2025-06-01",
      checkOut: "2025-06-07",
      guests: 2,
      rooms: 1,
      customerName: "Test",
      customerEmail: "test@test.com",
    });

    expect(result.confirmationId).toBeDefined();
    expect(result.status).toBe("confirmed");
    expect(result.provider).toBe("hotelbeds");
  });
});
