import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return new Response(
      JSON.stringify({ error: "This endpoint is disabled in production." }),
      { status: 403, headers: { "content-type": "application/json" } },
    );
  }

  const from = "ventas@tirandovino.com";
  const to = "taniatenoriomvz@gmail.com";

  if (!process.env.RESEND_API_KEY || !from || !to) {
    return new Response(
      JSON.stringify({
        error:
          "Missing Resend configuration. Set RESEND_API_KEY, RESEND_FROM_EMAIL and ORDER_NOTIFICATION_TO_EMAIL.",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const paymentRequestId = `test-${Date.now()}`;

  const message = [
    "Prueba de notificacion de compra (sin checkout)",
    `Payment request ID: ${paymentRequestId}`,
    "Receipt: TEST-RECEIPT",
    "Total: $399.00 MXN",
    "",
    "Productos:",
    "Vino de prueba x1 - $199.00",
    "Accesorio de prueba x1 - $200.00",
    "",
    "Cliente: Cliente de Prueba",
    "Correo: cliente.prueba@example.com",
    "Telefono: 5512345678",
    "Direccion: Calle de Prueba 123",
    "Estado: CDMX",
    "Ciudad: Ciudad de Mexico",
    "CP: 01000",
  ].join("\n");

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `TEST Compra completada #${paymentRequestId}`,
      text: message,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Email provider rejected request.",
          details: error.message,
        }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        mode: "test",
        payment_request_id: paymentRequestId,
        resend_id: data?.id || null,
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
