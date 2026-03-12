import fs from "fs";
import path from "path";

export async function POST(request, { params }) {
  const { type } = params;

  if (type !== "wine" && type !== "merch") {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json();
    const fileName = type === "wine" ? "database.json" : "merchdb.json";
    const filePath = path.join(process.cwd(), "src", "app", fileName);

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
