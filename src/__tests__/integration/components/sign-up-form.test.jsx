import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpForm from "@/app/auth/components/SignUpForm";
import { renderWithProviders } from "@/test-utils/render";

const mockSignup = jest.fn();

jest.mock("@/actions/auth/auth", () => ({
  signup: (...args) => mockSignup(...args),
}));

describe("SignUpForm", () => {
  const showFeedback = jest.fn();
  const setTypeSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows success feedback and returns to login after registration", async () => {
    mockSignup.mockResolvedValue({ success: true, data: {}, message: "ok" });

    renderWithProviders(
      <SignUpForm
        setTypeSelected={setTypeSelected}
        showFeedback={showFeedback}
      />,
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Nombre"), "Tania");
    await user.type(screen.getByLabelText("Correo"), "new@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "secret123");
    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: "Tania",
        email: "new@test.com",
        password: "secret123",
      });
      expect(setTypeSelected).toHaveBeenCalledWith("login");
      expect(showFeedback).toHaveBeenCalledWith(
        "Cuenta creada exitosamente. Ahora puedes iniciar sesion.",
      );
    });
  });

  it("shows translated feedback when signup fails", async () => {
    mockSignup.mockResolvedValue({
      success: false,
      message: "User already registered",
    });

    renderWithProviders(
      <SignUpForm
        setTypeSelected={setTypeSelected}
        showFeedback={showFeedback}
      />,
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Nombre"), "Tania");
    await user.type(screen.getByLabelText("Correo"), "new@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "secret123");
    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    await waitFor(() => {
      expect(showFeedback).toHaveBeenCalledWith(
        "Este correo electrónico ya está registrado.",
        "error",
      );
    });
  });
});
