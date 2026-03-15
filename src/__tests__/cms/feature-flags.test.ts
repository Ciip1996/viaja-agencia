import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({ getAll: () => [] })),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [
            { key: "feature_chatbot", value: "true" },
            { key: "feature_tours", value: "true" },
            { key: "feature_instagram", value: "false" },
          ],
          error: null,
        })),
      })),
    })),
  })),
}));

beforeEach(() => {
  vi.resetModules();
});

describe("getFeatureFlags", () => {
  it("returns merged flags with defaults", async () => {
    const { getFeatureFlags } = await import("@/lib/cms/feature-flags");
    const flags = await getFeatureFlags();

    expect(flags.feature_chatbot).toBe(true);
    expect(flags.feature_tours).toBe(true);
    expect(flags.feature_instagram).toBe(false);
    // Defaults
    expect(flags.feature_blog).toBe(true);
    expect(flags.feature_hotel_booking).toBe(false);
  });

  it("returns all defaults when Supabase fails", async () => {
    vi.doMock("@supabase/ssr", () => ({
      createServerClient: vi.fn(() => ({
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => {
              throw new Error("Connection failed");
            }),
          })),
        })),
      })),
    }));

    const { getFeatureFlags } = await import("@/lib/cms/feature-flags");
    const flags = await getFeatureFlags();

    expect(flags.feature_blog).toBe(true);
    expect(flags.feature_tours).toBe(false);
    expect(flags.feature_chatbot).toBe(false);
  });
});

describe("getFeatureFlag", () => {
  it("returns a single flag value", async () => {
    const { getFeatureFlag } = await import("@/lib/cms/feature-flags");
    const value = await getFeatureFlag("feature_chatbot");
    expect(typeof value).toBe("boolean");
  });
});
