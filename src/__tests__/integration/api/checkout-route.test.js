/** @jest-environment node */

import { POST } from "@/app/api/checkout/route";

describe("checkout route", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns an error when no Clip token is configured", async () => {
    delete process.env.CLIP_TOKEN_TEST;
    delete process.env.CLIP_TOKEN_PROD;

    const response = await POST({ json: jest.fn().mockResolvedValue({}) });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Payment token not configured on server.",
    });
  });

  it("passes through upstream Clip errors", async () => {
    process.env.CLIP_TOKEN_TEST = "token";
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 422,
      text: jest.fn().mockResolvedValue("clip rejected the request"),
    });

    const response = await POST({
      json: jest.fn().mockResolvedValue({ purchase_description: "Wine order" }),
    });

    expect(global.fetch).toHaveBeenCalled();
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "clip rejected the request",
    });
  });

  it("returns the payment request url when Clip succeeds", async () => {
    process.env.CLIP_TOKEN_TEST = "token";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        payment_request_url: "https://pay.clip.mx/checkout/test",
      }),
    });

    const response = await POST({
      json: jest.fn().mockResolvedValue({ purchase_description: "Wine order" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      payment_request_url: "https://pay.clip.mx/checkout/test",
    });
  });
});
