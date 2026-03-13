import fs from "fs";
import path from "path";
import { persistImageIfNeeded } from "@/utils/helpers";
import { getCountryCodeFromValue } from "@/utils/countries";

export async function PUT(request, { params }) {
  const { type, id } = params;
  const itemId = parseInt(id);

  try {
    const body = await request.json();

    // Determine the database file path
    const fileName = type === "wine" ? "database.json" : "merchdb.json";
    const filePath = path.join(process.cwd(), "src", "app", fileName);

    // Read the current database
    const fileContent = fs.readFileSync(filePath, "utf-8");
    let database = JSON.parse(fileContent);

    // Find and update the item
    const itemIndex = database.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
      });
    }

    // Update the item
    const updatedItem = { ...database[itemIndex], ...body };
    if (updatedItem.country) {
      updatedItem.country = getCountryCodeFromValue(updatedItem.country);
    }
    updatedItem.imageURL = persistImageIfNeeded(updatedItem, type);
    database[itemIndex] = updatedItem;

    // Write back to the file
    fs.writeFileSync(filePath, JSON.stringify(database, null, 2));

    return new Response(JSON.stringify(database[itemIndex]), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return new Response(JSON.stringify({ error: "Failed to update item" }), {
      status: 500,
    });
  }
}
