import fs from "fs";
import {
  getImageExtensionFromMimeType,
  getImageUrl,
  normalizeFilePart,
  persistImageIfNeeded,
} from "@/utils/helpers";

describe("helpers", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("normalizes file parts into lowercase snake case", () => {
    expect(normalizeFilePart(" Viña Ñandú Reserva ", "fallback")).toBe(
      "vina_nandu_reserva",
    );
  });

  it("uses the fallback when the value is nullish", () => {
    expect(normalizeFilePart(null, "Casa 12")).toBe("casa_12");
  });

  it("maps supported mime types and falls back to png", () => {
    expect(getImageExtensionFromMimeType("image/webp")).toBe("webp");
    expect(getImageExtensionFromMimeType("application/json")).toBe("png");
  });

  it("persists a base64 image into public assets and returns the public path", () => {
    const mkdirSyncSpy = jest
      .spyOn(fs, "mkdirSync")
      .mockImplementation(() => undefined);
    const writeFileSyncSpy = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => undefined);

    const result = persistImageIfNeeded(
      {
        house: "Casa Madero",
        imageURL: "data:image/png;base64,ZmFrZS1pbWFnZQ==",
        name: "Rosado Especial",
      },
      "wine",
    );

    expect(result).toBe("/assets/casa_madero_rosado_especial.png");
    expect(mkdirSyncSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it("returns the original image when it is already a public url", () => {
    expect(
      persistImageIfNeeded(
        {
          imageURL: "/assets/existing.png",
          name: "Rosado Especial",
        },
        "wine",
      ),
    ).toBe("/assets/existing.png");
  });

  it("appends a cache-busting query string to image urls", () => {
    jest.spyOn(Date.prototype, "getTime").mockReturnValue(12345);

    expect(getImageUrl("/assets/existing.png")).toBe(
      "/assets/existing.png?t=12345",
    );
  });
});
