import { ENV, HOME_URL, DEV_HOME_URL } from "@/utils/constants";

const redirectionUrl = (ENV === "development" ? DEV_HOME_URL : HOME_URL).replace(/\/$/, "");

export async function POST(req) {
  try {
    const body = await req.json();

    const token = process.env.CLIP_TOKEN_TEST || process.env.CLIP_TOKEN_PROD;
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Payment token not configured on server." }),
        { status: 500, headers: { "content-type": "application/json" } },
      );
    }

    console.log("Received checkout request with body:", body);

    const payload = {
      ...body,
      redirection_url: {
        success: `${redirectionUrl}/purchase-success`,
        error: `${redirectionUrl}/purchase-success`,
        default: `${redirectionUrl}/purchase-success`,
      },
    };

    const res = await fetch("https://api.payclip.com/v2/checkout", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: text }), {
        status: res.status,
        headers: { "content-type": "application/json" },
      });
    }

    const data = await res.json();
    console.log("--------Checkout API response:---------", data);
    return new Response(
      JSON.stringify({
        payment_request_url: data.payment_request_url,
        payment_request_id: data.payment_request_id,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
