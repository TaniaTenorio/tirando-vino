const mockGetPublicUrl = jest.fn();
const mockRemove = jest.fn();
const mockUpload = jest.fn();
const mockFrom = jest.fn((bucket) => ({
  getPublicUrl: (...args) => mockGetPublicUrl(bucket, ...args),
  remove: (...args) => mockRemove(bucket, ...args),
  upload: (...args) => mockUpload(bucket, ...args),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import {
  dataUrlToBuffer,
  getImageExtensionFromMimeType,
  isDataImage,
  removeImageByPublicUrl,
  uploadBase64Image,
} from "@/lib/supabase/storage-helpers";

describe("storage helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createClient.mockResolvedValue({
      storage: {
        from: mockFrom,
      },
    });
  });

  it("detects base64 image urls", () => {
    expect(isDataImage("data:image/png;base64,ZmFrZQ==")).toBe(true);
    expect(isDataImage("/assets/wine.png")).toBe(false);
    expect(isDataImage(null)).toBe(false);
  });

  it("parses a data url into mime type and buffer", () => {
    const parsed = dataUrlToBuffer("data:image/png;base64,ZmFrZQ==");

    expect(parsed.mimeType).toBe("image/png");
    expect(parsed.buffer.toString()).toBe("fake");
  });

  it("returns null for malformed data urls", () => {
    expect(dataUrlToBuffer("not-a-data-url")).toBeNull();
  });

  it("maps image extensions with a png fallback", () => {
    expect(getImageExtensionFromMimeType("image/avif")).toBe("avif");
    expect(getImageExtensionFromMimeType("text/plain")).toBe("png");
  });

  it("returns null when uploadBase64Image receives an invalid data url", async () => {
    await expect(
      uploadBase64Image({
        dataUrl: "invalid",
        bucket: "wines-images",
      }),
    ).resolves.toBeNull();
  });

  it("uploads a parsed image and returns the resulting public url", async () => {
    jest.spyOn(global.crypto, "randomUUID").mockReturnValue("uuid-123");
    mockUpload.mockResolvedValue({
      data: { path: "wines/uuid-123.png" },
      error: null,
    });
    mockGetPublicUrl.mockReturnValue({
      data: {
        publicUrl:
          "https://example.supabase.co/storage/v1/object/public/wines-images/wines/uuid-123.png",
      },
    });

    await expect(
      uploadBase64Image({
        dataUrl: "data:image/png;base64,ZmFrZQ==",
        bucket: "wines-images",
        folder: "wines",
      }),
    ).resolves.toEqual({
      path: "wines/uuid-123.png",
      publicUrl:
        "https://example.supabase.co/storage/v1/object/public/wines-images/wines/uuid-123.png",
    });
  });

  it("does nothing when the public url cannot be mapped back to a storage path", async () => {
    await removeImageByPublicUrl({
      publicUrl: "/assets/local.png",
      bucket: "wines-images",
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it("removes the previous image when the public url matches the bucket path", async () => {
    mockRemove.mockResolvedValue({ error: null });

    await removeImageByPublicUrl({
      publicUrl:
        "https://example.supabase.co/storage/v1/object/public/wines-images/wines/uuid-123.png",
      bucket: "wines-images",
    });

    expect(mockRemove).toHaveBeenCalledWith("wines-images", [
      "wines/uuid-123.png",
    ]);
  });
});
