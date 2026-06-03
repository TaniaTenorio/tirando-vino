import { buildPurchaseConfirmationEmail } from "@/lib/emails/purchaseConfirmationTemplate";

const defaultPayload = () => ({
  paymentRequestId: `preview-${Date.now()}`,
  receiptNo: "TEST-RECEIPT-001",
  cart: [
    {
      productId: "wine-1",
      productName: "Vino Tinto Reserva",
      quantity: 1,
      productPrice: 450,
    },
    {
      productId: "merch-1",
      productName: "Sacacorchos Premium",
      quantity: 1,
      productPrice: 220,
    },
  ],
  contact: {
    name: "Cliente de Prueba",
    email: "cliente.prueba@example.com",
    phone: "5512345678",
    address: "Calle de Prueba 123",
    stateName: "CDMX",
    city: "Ciudad de Mexico",
    zip: "01000",
  },
});

const createResponse = (request, data) => {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  if (format === "html") {
    return new Response(data.html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  if (format === "text") {
    return new Response(data.text, {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      preview: data,
      usage: {
        json: "/api/checkout/notify/preview",
        html: "/api/checkout/notify/preview?format=html",
        text: "/api/checkout/notify/preview?format=text",
      },
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
};

const isDisabled = () => process.env.NODE_ENV === "production";

export async function GET(req) {
  if (isDisabled()) {
    return new Response(
      JSON.stringify({ error: "This endpoint is disabled in production." }),
      { status: 403, headers: { "content-type": "application/json" } },
    );
  }

  const previewData = buildPurchaseConfirmationEmail(defaultPayload());
  return createResponse(req, previewData);
}

export async function POST(req) {
  if (isDisabled()) {
    return new Response(
      JSON.stringify({ error: "This endpoint is disabled in production." }),
      { status: 403, headers: { "content-type": "application/json" } },
    );
  }

  try {
    const body = await req.json();
    const base = defaultPayload();

    const payload = {
      ...base,
      ...body,
      cart: Array.isArray(body?.cart) ? body.cart : base.cart,
      contact: {
        ...base.contact,
        ...(body?.contact || {}),
      },
    };

    const previewData = buildPurchaseConfirmationEmail(payload);
    return createResponse(req, previewData);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Invalid JSON body.",
        details: err.message,
      }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
