import { test, expect } from "@playwright/test";

test.describe("Admin Access Control", () => {
  test("unauthenticated access to /admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    // Should end up at the login page
    await page.waitForURL(/login/, { timeout: 10_000 });
    expect(page.url()).toContain("login");
  });

  test("admin login page loads", async ({ page }) => {
    const response = await page.goto("/admin/login");
    expect(response?.status()).toBe(200);

    // Should show email and password fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("login form validates required fields", async ({ page }) => {
    await page.goto("/admin/login");

    // Click login without filling in fields
    const loginBtn = page.locator('button[type="submit"]');
    await loginBtn.click();

    // Should stay on login page
    expect(page.url()).toContain("login");
  });
});

test.describe("Admin Routes Protected", () => {
  const adminRoutes = [
    "/admin/promociones",
    "/admin/paquetes",
    "/admin/destinos",
    "/admin/grupos",
    "/admin/eventos",
    "/admin/blog",
    "/admin/faq",
    "/admin/cotizaciones",
    "/admin/newsletter",
    "/admin/configuracion",
  ];

  for (const route of adminRoutes) {
    test(`${route} redirects unauthenticated users`, async ({ page }) => {
      await page.goto(route);
      await page.waitForURL(/login/, { timeout: 10_000 });
      expect(page.url()).toContain("login");
    });
  }
});
