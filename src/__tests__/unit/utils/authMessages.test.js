import { getAuthMessage } from "@/utils/authMessages";

describe("getAuthMessage", () => {
  it("returns the translated message when the backend error is known", () => {
    expect(getAuthMessage("Invalid login credentials", "fallback")).toBe(
      "Correo o contraseña incorrectos.",
    );
  });

  it("matches known messages when the backend includes extra text", () => {
    expect(
      getAuthMessage(
        "AuthApiError: User already registered in this project",
        "fallback",
      ),
    ).toBe("Este correo electrónico ya está registrado.");
  });

  it("returns the fallback message when the error is unknown", () => {
    expect(getAuthMessage("Unexpected error", "Mensaje genérico.")).toBe(
      "Mensaje genérico.",
    );
  });

  it("returns the fallback message when no error message is provided", () => {
    expect(getAuthMessage("", "Mensaje genérico.")).toBe("Mensaje genérico.");
  });
});
