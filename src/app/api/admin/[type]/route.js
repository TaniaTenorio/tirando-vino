import fs from "fs";
import path from "path";
import { persistImageIfNeeded } from "@/utils/helpers";
import { getCountryCodeFromValue } from "@/utils/countries";

const getDatabaseFilePath = (type) => {
  const fileName = type === "wine" ? "database.json" : "merchdb.json";
  return path.join(process.cwd(), "src", "app", fileName);
};

const isValidType = (type) => type === "wine" || type === "merch";

export async function POST(request, { params }) {
  const { type } = params;

  if (!isValidType(type)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json();
    const filePath = getDatabaseFilePath(type);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const database = JSON.parse(fileContent);

    const highestId = database.reduce(
      (maxId, item) => (item.id > maxId ? item.id : maxId),
      0,
    );

    const newItem = {
      id: highestId + 1,
      ...body,
      state: body.state || "active",
    };

    if (newItem.country) {
      newItem.country = getCountryCodeFromValue(newItem.country);
    }

    newItem.imageURL = persistImageIfNeeded(newItem, type);

    database.push(newItem);
    fs.writeFileSync(filePath, JSON.stringify(database, null, 2));

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
  const { type } = params;

  if (!isValidType(type)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json();
    const { ids = [], state } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "No item ids provided" }), {
        status: 400,
      });
    }

    if (state !== "active" && state !== "inactive") {
      return new Response(JSON.stringify({ error: "Invalid state value" }), {
        status: 400,
      });
    }

    const filePath = getDatabaseFilePath(type);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const database = JSON.parse(fileContent);
    const selectedIds = new Set(ids.map((id) => Number(id)));

    const updatedDatabase = database.map((item) =>
      selectedIds.has(item.id) ? { ...item, state } : item,
    );

    fs.writeFileSync(filePath, JSON.stringify(updatedDatabase, null, 2));

    return new Response(
      JSON.stringify(
        updatedDatabase.filter((item) => selectedIds.has(item.id)),
      ),
      {
        status: 200,
      },
    );
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
