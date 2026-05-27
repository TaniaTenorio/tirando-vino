import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { statusData, cart, contact } = body || {};

    if (statusData?.status !== "CHECKOUT_COMPLETED") {
      return new Response(
        JSON.stringify({
          error: "Notification is only sent for completed checkouts.",
        }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const paymentRequestId = statusData?.payment_request_id;
    if (!paymentRequestId) {
      return new Response(
        JSON.stringify({ error: "Missing payment_request_id." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.ORDER_NOTIFICATION_TO_EMAIL;

    if (!process.env.RESEND_API_KEY || !from || !to) {
      return new Response(
        JSON.stringify({
          error:
            "Missing Resend configuration. Set RESEND_API_KEY, RESEND_FROM_EMAIL and ORDER_NOTIFICATION_TO_EMAIL.",
        }),
        { status: 500, headers: { "content-type": "application/json" } },
      );
    }

    const safeCart = Array.isArray(cart) ? cart : [];

    const orderLines = safeCart
      .map(
        (item) =>
          `${item.productName} x${item.quantity} - $${(
            item.productPrice * item.quantity
          ).toFixed(2)}`,
      )
      .join("\n");

    const total = safeCart
      .reduce((acc, item) => acc + item.productPrice * item.quantity, 0)
      .toFixed(2);

    const message = [
      "Nueva compra completada en Tirando Vino",
      `Payment request ID: ${paymentRequestId}`,
      `Receipt: ${statusData?.receipt_no || "N/A"}`,
      `Total: $${total} MXN`,
      "",
      "Productos:",
      orderLines || "Sin productos",
      "",
      `Cliente: ${contact?.name || "N/A"}`,
      `Correo: ${contact?.email || "N/A"}`,
      `Telefono: ${contact?.phone || "N/A"}`,
      `Direccion: ${contact?.address || "N/A"}`,
      `Estado: ${contact?.stateName || "N/A"}`,
      `Ciudad: ${contact?.city || "N/A"}`,
      `CP: ${contact?.zip || "N/A"}`,
    ].join("\n");

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Compra completada #${paymentRequestId}`,
      text: message,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Email provider rejected request.",
          details: error.message,
        }),
        {
          status: 502,
          headers: { "content-type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
