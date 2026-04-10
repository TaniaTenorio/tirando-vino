/** @jest-environment node */

const mockCreateItem = jest.fn();
const mockGetItems = jest.fn();
const mockIsValidType = jest.fn();
const mockRequireAuth = jest.fn();
const mockUpdateItemsStatus = jest.fn();
const mockGetCountryCodeFromValue = jest.fn();

jest.mock("@/lib/supabase/helpers", () => ({
  createItem: (...args) => mockCreateItem(...args),
  getItems: (...args) => mockGetItems(...args),
  isValidType: (...args) => mockIsValidType(...args),
  updateItemsStatus: (...args) => mockUpdateItemsStatus(...args),
}));

jest.mock("@/lib/supabase/auth-helpers", () => ({
  requireAuth: (...args) => mockRequireAuth(...args),
}));

jest.mock("@/utils/countries", () => ({
  getCountryCodeFromValue: (...args) => mockGetCountryCodeFromValue(...args),
}));

import { GET, PATCH, POST } from "@/app/api/admin/[type]/route";

describe("admin [type] route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue(true);
    mockIsValidType.mockReturnValue(true);
  });

  it("returns unauthorized when the user is not authenticated", async () => {
    mockRequireAuth.mockResolvedValue(false);

    const response = await GET(
      {},
      { params: Promise.resolve({ type: "wine" }) },
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns a bad request when the type is invalid", async () => {
    mockIsValidType.mockReturnValue(false);

    const response = await GET(
      {},
      { params: Promise.resolve({ type: "beer" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid type" });
  });

  it("returns the requested items on a successful get", async () => {
    mockGetItems.mockResolvedValue([{ id: "wine-1" }]);

    const response = await GET(
      {},
      { params: Promise.resolve({ type: "wine" }) },
    );

    expect(mockGetItems).toHaveBeenCalledWith("wine");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([{ id: "wine-1" }]);
  });

  it("creates an item and converts the country value before persisting", async () => {
    mockGetCountryCodeFromValue.mockReturnValue("MX");
    mockCreateItem.mockResolvedValue({ id: "wine-1", country: "MX" });

    const response = await POST(
      {
        json: jest.fn().mockResolvedValue({
          country: "Mexico",
          name: "Rosado",
        }),
      },
      { params: Promise.resolve({ type: "wine" }) },
    );

    expect(mockGetCountryCodeFromValue).toHaveBeenCalledWith("Mexico");
    expect(mockCreateItem).toHaveBeenCalledWith("wine", {
      country: "MX",
      name: "Rosado",
    });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      id: "wine-1",
      country: "MX",
    });
  });

  it("rejects patch requests without ids", async () => {
    const response = await PATCH(
      {
        json: jest.fn().mockResolvedValue({ ids: [], status: "active" }),
      },
      { params: Promise.resolve({ type: "wine" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "No item ids provided",
    });
  });

  it("rejects patch requests with an invalid status value", async () => {
    const response = await PATCH(
      {
        json: jest.fn().mockResolvedValue({ ids: ["1"], status: "archived" }),
      },
      { params: Promise.resolve({ type: "wine" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid status value",
    });
  });

  it("updates the status of multiple items", async () => {
    mockUpdateItemsStatus.mockResolvedValue([{ id: "1", status: "inactive" }]);

    const response = await PATCH(
      {
        json: jest.fn().mockResolvedValue({ ids: ["1"], status: "inactive" }),
      },
      { params: Promise.resolve({ type: "wine" }) },
    );

    expect(mockUpdateItemsStatus).toHaveBeenCalledWith(
      "wine",
      ["1"],
      "inactive",
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      { id: "1", status: "inactive" },
    ]);
  });

  it("returns a server error when reading items fails", async () => {
    mockGetItems.mockRejectedValue(new Error("boom"));
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = await GET(
      {},
      { params: Promise.resolve({ type: "wine" }) },
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to read items",
    });
    consoleErrorSpy.mockRestore();
  });
});
