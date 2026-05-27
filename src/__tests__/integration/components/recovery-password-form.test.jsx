import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecoveryPasswordForm from "@/app/auth/components/RecoveryPasswordForm";
import { renderWithProviders } from "@/test-utils/render";

const mockSendRecoveryEmail = jest.fn();

jest.mock("@/actions/auth/auth", () => ({
  sendRecoveryEmail: (...args) => mockSendRecoveryEmail(...args),
}));

describe("RecoveryPasswordForm", () => {
  const showFeedback = jest.fn();
  const setTypeSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends the recovery email and returns to login on success", async () => {
    mockSendRecoveryEmail.mockResolvedValue({
      success: true,
      message: "Correo enviado",
    });

    renderWithProviders(
      <RecoveryPasswordForm
        setTypeSelected={setTypeSelected}
        showFeedback={showFeedback}
      />,
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Correo"), "admin@test.com");
    await user.click(
      screen.getByRole("button", { name: "Recuperar contraseña" }),
    );

    await waitFor(() => {
      expect(mockSendRecoveryEmail).toHaveBeenCalledWith({
        email: "admin@test.com",
      });
      expect(showFeedback).toHaveBeenCalledWith("Correo enviado");
      expect(setTypeSelected).toHaveBeenCalledWith("login");
    });
  });

  it("shows translated feedback when the recovery request fails", async () => {
    mockSendRecoveryEmail.mockResolvedValue({
      success: false,
      message: "Invalid email",
    });

    renderWithProviders(
      <RecoveryPasswordForm
        setTypeSelected={setTypeSelected}
        showFeedback={showFeedback}
      />,
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Correo"), "admin@test.com");
    await user.click(
      screen.getByRole("button", { name: "Recuperar contraseña" }),
    );

    await waitFor(() => {
      expect(showFeedback).toHaveBeenCalledWith(
        "Por favor ingresa un correo electrónico válido.",
        "error",
      );
    });
  });
});
