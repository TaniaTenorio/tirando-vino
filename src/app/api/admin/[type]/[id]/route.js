import {
  deleteItem,
  getItemById,
  isValidType,
  updateItem,
} from "@/lib/supabase/helpers";
import { getCountryCodeFromValue } from "@/utils/countries";

const parseIdByType = (_type, id) => id;

export async function GET(request, { params }) {
  const { type, id } = await params;

  if (!isValidType(type)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const parsedId = parseIdByType(type, id);

    const item = await getItemById(type, parsedId);

    if (!item) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting item:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch item" }), {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  const { type, id } = await params;

  if (!isValidType(type)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json();

    if (body.country) {
      body.country = getCountryCodeFromValue(body.country);
    }

    const parsedId = parseIdByType(type, id);

    const updated = await updateItem(type, parsedId, body);

    if (!updated) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return new Response(JSON.stringify({ error: "Failed to update item" }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  const { type, id } = await params;

  if (!isValidType(type)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hardDelete") === "true";
    const parsedId = parseIdByType(type, id);

    const deletedItem = await deleteItem(type, parsedId, hardDelete);

    if (!deletedItem) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(deletedItem), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return new Response(JSON.stringify({ error: "Failed to delete item" }), {
      status: 500,
    });
  }
}
