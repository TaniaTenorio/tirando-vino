import fs from "fs";
import path from "path";

export const normalizeFilePart = (value, fallback) => {
  const source = value ?? fallback;

  return source
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

export const getImageExtensionFromMimeType = (mimeType) => {
  const extensionMap = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };

  return extensionMap[mimeType] || "png";
};

export const persistImageIfNeeded = (itemData, type) => {
  const imageValue = itemData.imageURL;
  if (typeof imageValue !== "string" || !imageValue.startsWith("data:image/")) {
    return imageValue;
  }

  const dataUrlMatch = imageValue.match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
  );
  if (!dataUrlMatch) {
    return imageValue;
  }

  const [, mimeType, base64Data] = dataUrlMatch;
  const extension = getImageExtensionFromMimeType(mimeType);
  const housePart = normalizeFilePart(
    itemData.house,
    type === "wine" ? "wine" : "merch",
  );
  const namePart = normalizeFilePart(itemData.name, "item");
  const fileName = `${housePart}_${namePart}.${extension}`;

  const assetsDirectory = path.join(process.cwd(), "public", "assets");
  fs.mkdirSync(assetsDirectory, { recursive: true });

  const outputPath = path.join(assetsDirectory, fileName);
  fs.writeFileSync(outputPath, Buffer.from(base64Data, "base64"));

  return `/assets/${fileName}`;
};

export const getImageUrl = (url) => {
  if (!url) return "";
  // add timestamp to avoid caching issues
  return `${url}?t=${new Date().getTime()}`;
};
