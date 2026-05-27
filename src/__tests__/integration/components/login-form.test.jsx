import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/auth/components/LoginForm";
import { renderWithProviders } from "@/test-utils/render";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockLogin = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock("@/actions/auth/auth", () => ({
  login: (...args) => mockLogin(...args),
}));

describe("LoginForm", () => {
  const showFeedback = jest.fn();
  const setTypeSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits credentials and redirects to admin when login succeeds", async () => {
    mockLogin.mockResolvedValue({ success: true, data: {}, message: "ok" });

    renderWithProviders(
      <LoginForm
        setTypeSelected={setTypeSelected}
        showFeedback={showFeedback}
      />,
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Correo"), "admin@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "secret123");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "secret123",
      });
      expect(mockPush).toHaveBeenCalledWith("/admin");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("shows translated feedback when login fails", async () => {
    mockLogin.mockResolvedValue({
      success: false,
      message: "Invalid login credentials",
    });

    renderWithProviders(
      <LoginForm
        setTypeSelected={setTypeSelected}
        showFeedback={showFeedback}
      />,
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Correo"), "admin@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "bad-password");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    await waitFor(() => {
      expect(showFeedback).toHaveBeenCalledWith(
        "Correo o contraseña incorrectos.",
        "error",
      );
    });
  });

  it("switches to password recovery when the user clicks the recovery action", async () => {
    renderWithProviders(
      <LoginForm
        setTypeSelected={setTypeSelected}
        showFeedback={showFeedback}
      />,
    );

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "¿Olvidaste tu contraseña?" }),
    );

    expect(setTypeSelected).toHaveBeenCalledWith("reset");
  });
});
