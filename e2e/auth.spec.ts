import { expect, test } from "@playwright/test";

test.describe("auth page", () => {
  test("renders login and switches between auth modes", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(
      page.getByText("Ingresa tus credenciales para acceder a tu cuenta."),
    ).toBeVisible();

    await page.getByRole("button", { name: "Regístrate" }).click();
    await expect(
      page.getByRole("heading", { name: "Crear cuenta" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Inicia sesión" }).click();
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

    await page
      .getByRole("button", { name: "¿Olvidaste tu contraseña?" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Recuperar contraseña" }),
    ).toBeVisible();
  });
});
