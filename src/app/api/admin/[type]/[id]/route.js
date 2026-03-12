import fs from "fs";
import path from "path";

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
    database[itemIndex] = { ...database[itemIndex], ...body };

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
