import { describe, it, expect } from "vitest";
import { formatPrice, formatDate, slugify } from "@/lib/utils/format";

describe("formatPrice", () => {
  it("formats USD prices with no decimals", () => {
    const result = formatPrice(3200, "USD", "en");
    expect(result).toContain("3,200");
    expect(result).toContain("$");
  });

  it("formats MXN prices in Spanish locale", () => {
    const result = formatPrice(5000, "MXN", "es");
    expect(result).toContain("5,000");
  });

  it("defaults to es-MX locale", () => {
    const result = formatPrice(1000);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles zero amount", () => {
    expect(formatPrice(0)).toBeDefined();
  });
});

describe("formatDate", () => {
  it("formats a date string in Spanish", () => {
    const result = formatDate("2024-06-15T12:00:00Z", undefined, "es");
    expect(result).toContain("2024");
    expect(result).toMatch(/junio/);
  });

  it("formats a date string in English", () => {
    const result = formatDate("2024-06-15T12:00:00Z", undefined, "en");
    expect(result).toContain("2024");
    expect(result).toMatch(/June/);
  });

  it("accepts a Date object", () => {
    const result = formatDate(new Date(2024, 5, 15), undefined, "es");
    expect(result).toContain("2024");
  });

  it("applies custom format options", () => {
    const result = formatDate("2024-06-15", { month: "short" }, "en");
    expect(result).toContain("Jun");
  });
});

describe("slugify", () => {
  it("converts text to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes accented characters", () => {
    expect(slugify("Cancún México")).toBe("cancun-mexico");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! @World #2024")).toBe("hello-world-2024");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("collapses multiple spaces/hyphens", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });
});
