import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPage from "@/app/admin/page";
import { renderWithProviders } from "@/test-utils/render";

const mockReplace = jest.fn();
const mockRefresh = jest.fn();
const mockUseAuth = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock(
  "@/app/admin/components/Header",
  () =>
    ({ onLogout, isSigningOut }) => (
      <button onClick={onLogout} disabled={isSigningOut}>
        {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    ),
);

jest.mock("@/app/admin/components/Navbar", () => ({ handleOnChange }) => (
  <div>
    <button onClick={() => handleOnChange(null, 0)}>Vinos</button>
    <button onClick={() => handleOnChange(null, 1)}>Merch</button>
    <button onClick={() => handleOnChange(null, 2)}>Bodegas</button>
  </div>
));

jest.mock("@/app/admin/components/WinesTable", () => ({ initialRows }) => (
  <div>WinesTable rows: {initialRows.length}</div>
));

jest.mock("@/app/admin/components/MerchTable", () => ({ initialRows }) => (
  <div>MerchTable rows: {initialRows.length}</div>
));

jest.mock("@/app/admin/components/HousesTable", () => ({ initialRows }) => (
  <div>HousesTable rows: {initialRows.length}</div>
));

const jsonResponse = (data, ok = true) => ({
  ok,
  json: jest.fn().mockResolvedValue(data),
});

describe("AdminPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("shows the loading state while auth is loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      getUserData: jest.fn(),
    });

    renderWithProviders(<AdminPage />);

    expect(
      screen.getByText("Cargando panel de administrador..."),
    ).toBeInTheDocument();
  });

  it("asks for user data when auth is idle and no user is available", async () => {
    const getUserData = jest.fn();
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      getUserData,
    });

    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(getUserData).toHaveBeenCalled();
    });
  });

  it("renders an error state and retries admin data loading", async () => {
    mockUseAuth.mockReturnValue({
      user: { name: "Tania" },
      isLoading: false,
      getUserData: jest.fn(),
    });

    global.fetch
      .mockResolvedValueOnce(jsonResponse([], false))
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse([{ id: "wine-1" }]))
      .mockResolvedValueOnce(jsonResponse([{ id: "merch-1" }]))
      .mockResolvedValueOnce(jsonResponse([{ id: "house-1" }]));

    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByText("No se pudo cargar el panel de administrador"),
    ).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Intentar de nuevo" }));

    expect(
      await screen.findByText("Hola Tania! Este es tu panel de administrador."),
    ).toBeInTheDocument();
    expect(screen.getByText("WinesTable rows: 1")).toBeInTheDocument();
  });

  it("loads admin data, switches tabs, and signs the user out", async () => {
    mockUseAuth.mockReturnValue({
      user: { name: "Tania" },
      isLoading: false,
      getUserData: jest.fn(),
    });

    global.fetch.mockImplementation((url, options) => {
      if (url === "/api/admin/wine")
        return Promise.resolve(jsonResponse([{ id: "wine-1" }]));
      if (url === "/api/admin/merch")
        return Promise.resolve(
          jsonResponse([{ id: "merch-1" }, { id: "merch-2" }]),
        );
      if (url === "/api/admin/house")
        return Promise.resolve(jsonResponse([{ id: "house-1" }]));
      if (url === "/api/auth/signout" && options?.method === "POST") {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
    });

    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByText("Hola Tania! Este es tu panel de administrador."),
    ).toBeInTheDocument();
    expect(screen.getByText("WinesTable rows: 1")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Merch" }));
    expect(screen.getByText("MerchTable rows: 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Bodegas" }));
    expect(screen.getByText("HousesTable rows: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
