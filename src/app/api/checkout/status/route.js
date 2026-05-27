export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Missing payment_request_id." }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const token = process.env.CLIP_TOKEN_TEST || process.env.CLIP_TOKEN_PROD;
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Payment token not configured on server." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  try {
    const res = await fetch(`https://api.payclip.com/v2/checkout/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Basic ${token}`,
      },
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
