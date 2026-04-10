jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import {
  login,
  sendRecoveryEmail,
  signup,
  updatePassword,
} from "@/actions/auth/auth";

const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockResetPasswordForEmail = jest.fn();
const mockUpdateUser = jest.fn();

describe("auth actions", () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        resetPasswordForEmail: mockResetPasswordForEmail,
        signInWithPassword: mockSignInWithPassword,
        signUp: mockSignUp,
        updateUser: mockUpdateUser,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a success response when login succeeds", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    });

    await expect(
      login({ email: "admin@test.com", password: "secret123" }),
    ).resolves.toEqual({
      success: true,
      message: "User logged in successfully",
      data: { session: { access_token: "token" } },
    });
  });

  it("returns an error response when login fails", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "Invalid login credentials" },
    });

    await expect(
      login({ email: "admin@test.com", password: "bad-password" }),
    ).resolves.toEqual({
      success: false,
      message: "Invalid login credentials",
    });
  });

  it("passes signup metadata to supabase", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    await expect(
      signup({
        email: "new@test.com",
        name: "Tania",
        password: "secret123",
      }),
    ).resolves.toEqual({
      success: true,
      message: "User signed up successfully",
      data: { user: { id: "123" } },
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "new@test.com",
      password: "secret123",
      options: {
        data: {
          name: "Tania",
        },
      },
    });
  });

  it("returns an error response when signup fails", async () => {
    mockSignUp.mockResolvedValue({
      data: null,
      error: { message: "User already registered" },
    });

    await expect(
      signup({
        email: "new@test.com",
        name: "Tania",
        password: "secret123",
      }),
    ).resolves.toEqual({
      success: false,
      message: "User already registered",
    });
  });

  it("returns success when sending the recovery email succeeds", async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      data: { sent: true },
      error: null,
    });

    await expect(
      sendRecoveryEmail({ email: "admin@test.com" }),
    ).resolves.toEqual({
      success: true,
      message:
        "Correo de recuperación enviado exitosamente. Revisa tu bandeja de entrada.",
      data: { sent: true },
    });
  });

  it("returns an error response when sending the recovery email fails", async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      data: null,
      error: { message: "Invalid email" },
    });

    await expect(sendRecoveryEmail({ email: "bad@test.com" })).resolves.toEqual(
      {
        success: false,
        message: "Invalid email",
      },
    );
  });

  it("returns success when updating the password succeeds", async () => {
    mockUpdateUser.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    await expect(updatePassword({ password: "newSecret123" })).resolves.toEqual(
      {
        success: true,
        message: "Contraseña actualizada exitosamente",
        data: { user: { id: "123" } },
      },
    );
  });

  it("returns an error response when updating the password fails", async () => {
    mockUpdateUser.mockResolvedValue({
      data: null,
      error: { message: "Password should be at least 6 characters" },
    });

    await expect(updatePassword({ password: "123" })).resolves.toEqual({
      success: false,
      message: "Password should be at least 6 characters",
    });
  });
});
