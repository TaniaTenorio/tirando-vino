import { createClient } from "@/lib/supabase/server";

const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export const getImageExtensionFromMimeType = (mimeType) =>
  MIME_TO_EXT[mimeType] || "png";

export const isDataImage = (value) =>
  typeof value === "string" && value.startsWith("data:image/");

export const dataUrlToBuffer = (dataUrl) => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const [, mimeType, base64Data] = match;

  return {
    mimeType,
    buffer: Buffer.from(base64Data, "base64"),
  };
};

const getPathFromPublicUrl = (publicUrl, bucket) => {
  if (!publicUrl || typeof publicUrl !== "string") return null;

  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return null;

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
};

export const uploadBase64Image = async ({
  dataUrl,
  bucket,
  folder = "items",
}) => {
  const parsed = dataUrlToBuffer(dataUrl);

  if (!parsed) return null;

  const { mimeType, buffer } = parsed;
  const extension = getImageExtensionFromMimeType(mimeType);
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
};

export const removeImageByPublicUrl = async ({ publicUrl, bucket }) => {
  const path = getPathFromPublicUrl(publicUrl, bucket);

  if (!path) return;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Failed to remove old image:", error);
  }
};
