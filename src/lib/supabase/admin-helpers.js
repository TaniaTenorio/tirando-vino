import { createClient } from "@/lib/supabase/server";
import {
  isDataImage,
  removeImageByPublicUrl,
  uploadBase64Image,
} from "@/lib/supabase/storage-helpers";

const TABLE_BY_TYPE = {
  wine: "wines",
  merch: "merch",
};

const BUCKET_BY_TYPE = {
  wine: "wines-images",
  merch: "merch-images",
};

const FOLDER_BY_TYPE = {
  wine: "wines",
  merch: "merch",
};

export const isValidType = (type) => type === "wine" || type === "merch";

const mapImageForClient = (item) => ({
  ...item,
  imageURL: item.image || "",
});

const normalizeByTypeForDb = async ({ type, payload, existingItem = null }) => {
  const normalized = { ...payload };

  delete normalized.id;
  delete normalized.image;

  if (normalized.country) {
    normalized.country = normalized.country.toUpperCase();
  }

  if (Object.hasOwn(normalized, "year") && normalized.year === "") {
    normalized.year = null;
  }

  if (Object.hasOwn(normalized, "price") && normalized.price !== "") {
    normalized.price = Number(normalized.price);
  }

  const incomingImage = normalized.imageURL;
  delete normalized.imageURL;

  if (isDataImage(incomingImage)) {
    const uploaded = await uploadBase64Image({
      dataUrl: incomingImage,
      bucket: BUCKET_BY_TYPE[type],
      folder: FOLDER_BY_TYPE[type],
    });

    if (existingItem?.image && existingItem.image !== uploaded.publicUrl) {
      await removeImageByPublicUrl({
        publicUrl: existingItem.image,
        bucket: BUCKET_BY_TYPE[type],
      });
    }

    normalized.image = uploaded.publicUrl;
  } else if (typeof incomingImage === "string") {
    normalized.image = incomingImage;
  }

  return normalized;
};

export const getItems = async (type) => {
  const supabase = await createClient();
  const table = TABLE_BY_TYPE[type];

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapImageForClient);
};

export const getItemById = async (type, id) => {
  const supabase = await createClient();
  const table = TABLE_BY_TYPE[type];

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data ? mapImageForClient(data) : null;
};

export const createItem = async (type, payload) => {
  const supabase = await createClient();
  const table = TABLE_BY_TYPE[type];
  const now = new Date().toISOString();

  const normalized = await normalizeByTypeForDb({ type, payload });
  normalized.status = normalized.status || "active";
  normalized.created_at = now;
  normalized.updated_at = now;

  const { data, error } = await supabase
    .from(table)
    .insert(normalized)
    .select("*")
    .single();

  if (error) throw error;

  return mapImageForClient(data);
};

export const updateItem = async (type, id, payload) => {
  const supabase = await createClient();
  const table = TABLE_BY_TYPE[type];

  const existing = await getItemById(type, id);

  if (!existing) {
    return null;
  }

  const normalized = await normalizeByTypeForDb({
    type,
    payload,
    existingItem: existing,
  });

  normalized.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from(table)
    .update(normalized)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;

  return data ? mapImageForClient(data) : null;
};

export const updateItemsStatus = async (type, ids, status) => {
  const supabase = await createClient();
  const table = TABLE_BY_TYPE[type];
  const parsedIds = ids.map(String);

  const { data, error } = await supabase
    .from(table)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .in("id", parsedIds)
    .select("*");

  if (error) throw error;

  return (data || []).map(mapImageForClient);
};

export const deleteItem = async (type, id, hardDelete) => {
  const supabase = await createClient();
  const table = TABLE_BY_TYPE[type];

  if (!hardDelete) {
    const { data, error } = await supabase
      .from(table)
      .update({
        status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;

    return data ? mapImageForClient(data) : null;
  }

  const existing = await getItemById(type, id);

  if (!existing) {
    return null;
  }

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) throw error;

  if (existing.image) {
    await removeImageByPublicUrl({
      publicUrl: existing.image,
      bucket: BUCKET_BY_TYPE[type],
    });
  }

  return mapImageForClient(existing);
};
