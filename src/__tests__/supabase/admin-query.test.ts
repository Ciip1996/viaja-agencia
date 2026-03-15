import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();
const mockSupabase = { from: mockFrom };

vi.mock("@/lib/supabase/admin-client", () => ({
  createAdminClient: () => mockSupabase,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function chainQuery(result: { data?: unknown; error?: unknown }) {
  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    order: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    then: (resolve: (v: unknown) => void) => resolve(result),
  };
  // Make the chain thenable (works with await)
  Object.defineProperty(chain, Symbol.toStringTag, { value: "Promise" });
  return chain;
}

describe("fetchWithLocale", () => {
  it("fetches with locale filter when column exists", async () => {
    const data = [{ id: "1", title: "Test" }];
    const chain = chainQuery({ data, error: null });
    mockFrom.mockReturnValue(chain);

    const { fetchWithLocale } = await import("@/lib/supabase/admin-query");
    const result = await fetchWithLocale("promotions", "es");

    expect(result.data).toEqual(data);
    expect(result.hasLocale).toBe(true);
    expect(chain.eq).toHaveBeenCalledWith("locale", "es");
  });

  it("retries without locale on error 42703", async () => {
    const data = [{ id: "1", title: "Test" }];

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return chainQuery({ data: null, error: { code: "42703", message: "column does not exist" } });
      }
      return chainQuery({ data, error: null });
    });

    const { fetchWithLocale } = await import("@/lib/supabase/admin-query");
    const result = await fetchWithLocale("promotions", "es");

    expect(result.data).toEqual(data);
    expect(result.hasLocale).toBe(false);
    expect(callCount).toBe(2);
  });

  it("throws on non-42703 errors", async () => {
    mockFrom.mockReturnValue(
      chainQuery({ data: null, error: { code: "PGRST000", message: "connection refused" } })
    );

    const { fetchWithLocale } = await import("@/lib/supabase/admin-query");
    await expect(fetchWithLocale("promotions", "es")).rejects.toEqual(
      expect.objectContaining({ code: "PGRST000" })
    );
  });
});

describe("deleteRow", () => {
  it("deletes by id", async () => {
    const chain = chainQuery({ error: null });
    mockFrom.mockReturnValue(chain);

    const { deleteRow } = await import("@/lib/supabase/admin-query");
    await deleteRow("promotions", "abc-123");

    expect(mockFrom).toHaveBeenCalledWith("promotions");
    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith("id", "abc-123");
  });

  it("throws on error", async () => {
    mockFrom.mockReturnValue(
      chainQuery({ error: { code: "42P01", message: "table not found" } })
    );

    const { deleteRow } = await import("@/lib/supabase/admin-query");
    await expect(deleteRow("promotions", "abc")).rejects.toEqual(
      expect.objectContaining({ code: "42P01" })
    );
  });
});
