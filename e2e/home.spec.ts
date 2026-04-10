import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("opens the cart drawer from the public storefront", async ({ page }) => {
    test.skip(
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "Home smoke requires Supabase environment variables.",
    );

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Explora nuestros vinos" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Abrir carrito" }).click();
    await expect(
      page.getByRole("heading", { name: "Tu carrito" }),
    ).toBeVisible();
    await expect(
      page.getByText("Aún no haz agregado productos a tu carrito"),
    ).toBeVisible();
  });
});
