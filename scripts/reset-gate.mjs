const baseUrl = process.env.RESET_GATE_URL || "http://localhost:3000";
const endpoint = new URL("/api/age-gate", baseUrl).toString();

const main = async () => {
  try {
    const response = await fetch(endpoint, { method: "DELETE" });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Failed to reset age gate.", payload);
      process.exit(1);
    }

    console.log("Age gate reset successfully.", payload);
  } catch (error) {
    console.error(
      "Could not reach the app. Make sure your dev server is running on",
      baseUrl,
    );
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

void main();
