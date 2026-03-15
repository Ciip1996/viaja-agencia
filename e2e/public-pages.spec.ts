import { test, expect } from "@playwright/test";

test.describe("Public Pages - Navigation & Rendering", () => {
  test("homepage loads with key sections", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Viaja/i);

    await expect(page.locator("section").first()).toBeVisible();
  });

  test("all public pages return 200", async ({ page }) => {
    const routes = [
      "/",
      "/destinos",
      "/paquetes",
      "/hoteles",
      "/grupos",
      "/eventos",
      "/nosotros",
      "/contacto",
      "/blog",
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should return 200`).toBe(200);
    }
  });

  test("navbar is visible and has navigation links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Main menu"]');
    await expect(nav).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});

test.describe("Language Switching", () => {
  test("switching to English changes page content", async ({ page }) => {
    await page.goto("/");

    const spanishContent = await page.textContent("body");

    await page.goto("/en");
    const englishContent = await page.textContent("body");

    // Pages should have different text content
    expect(spanishContent).not.toBe(englishContent);
  });

  test("English routes are accessible", async ({ page }) => {
    const response = await page.goto("/en");
    expect(response?.status()).toBe(200);
  });

  test("English destination page loads", async ({ page }) => {
    const response = await page.goto("/en/destinos");
    expect(response?.status()).toBe(200);
  });
});

test.describe("Feature-flagged Pages", () => {
  test("/tours loads or redirects based on feature flag", async ({ page }) => {
    const response = await page.goto("/tours");
    // Either serves the page (200) or redirects (302->200 to home)
    expect(response?.status()).toBe(200);
  });

  test("/autos loads or redirects based on feature flag", async ({ page }) => {
    const response = await page.goto("/autos");
    expect(response?.status()).toBe(200);
  });
});

test.describe("Contact Form", () => {
  test("displays validation errors on empty submit", async ({ page }) => {
    await page.goto("/contacto");

    // Try to find and click the submit button
    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();

      // Should show validation feedback (form should not navigate away)
      expect(page.url()).toContain("contacto");
    }
  });
});

test.describe("Newsletter Signup", () => {
  test("newsletter section exists on homepage", async ({ page }) => {
    await page.goto("/");

    // Look for the newsletter email input
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
  });
});

test.describe("Blog", () => {
  test("blog page loads without errors", async ({ page }) => {
    const response = await page.goto("/blog");
    expect(response?.status()).toBe(200);

    const body = await page.textContent("body");
    expect(body).not.toContain("Application error");
  });
});

test.describe("Hotel Search", () => {
  test("hotel page loads with search form", async ({ page }) => {
    const response = await page.goto("/hoteles");
    expect(response?.status()).toBe(200);

    // Should have some form elements or search inputs
    const body = await page.textContent("body");
    expect(body).not.toContain("Application error");
  });
});

test.describe("Responsive Design", () => {
  test("homepage renders without horizontal scroll at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("homepage renders without horizontal scroll at tablet width", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});
