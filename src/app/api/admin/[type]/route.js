import {
  createItem,
  getItems,
  isValidType,
  updateItemsStatus,
} from "@/lib/supabase/helpers";
import { createClient } from "@/lib/supabase/server";
import { getCountryCodeFromValue } from "@/utils/countries";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  return user;
}

export async function GET(request, { params }) {
  const { type } = await params;

  if (!(await requireAuth())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!isValidType(type)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const items = await getItems(type);

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading items:", error);
    return new Response(JSON.stringify({ error: "Failed to read items" }), {
      status: 500,
    });
  }
}

export async function POST(request, { params }) {
  const { type } = await params;

  if (!(await requireAuth())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

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

    const newItem = await createItem(type, body);

    return new Response(JSON.stringify(newItem), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    return new Response(JSON.stringify({ error: "Failed to create item" }), {
      status: 500,
    });
  }
}

export async function PATCH(request, { params }) {
  const { type } = await params;

  if (!(await requireAuth())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!isValidType(type)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json();
    const { ids = [], status } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "No item ids provided" }), {
        status: 400,
      });
    }

    if (status !== "active" && status !== "inactive") {
      return new Response(JSON.stringify({ error: "Invalid status value" }), {
        status: 400,
      });
    }

    const updated = await updateItemsStatus(type, ids, status);

    return new Response(JSON.stringify(updated), {
      status: 200,
    });
  } catch (error) {
    console.error("Error bulk updating items:", error);
    return new Response(
      JSON.stringify({ error: "Failed to bulk update items" }),
      {
        status: 500,
      },
    );
  }
}
