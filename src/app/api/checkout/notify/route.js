import { Resend } from "resend";
import {
  buildAdminOrderNotificationEmail,
  buildPurchaseConfirmationEmail,
} from "@/lib/emails/purchaseConfirmationTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { payment_request_id: paymentRequestId, cart, contact } = body || {};

    if (!paymentRequestId) {
      return new Response(
        JSON.stringify({ error: "Missing payment_request_id." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    if (!/^[\w-]+$/.test(paymentRequestId)) {
      return new Response(
        JSON.stringify({ error: "Invalid payment_request_id format." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const clipToken =
      process.env.NODE_ENV === "production"
        ? process.env.CLIP_TOKEN_PROD
        : process.env.CLIP_TOKEN_TEST;
    if (!clipToken) {
      return new Response(
        JSON.stringify({ error: "Payment token not configured on server." }),
        { status: 500, headers: { "content-type": "application/json" } },
      );
    }

    const clipRes = await fetch(
      `https://api.payclip.com/v2/checkout/${paymentRequestId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Basic ${clipToken}`,
        },
      },
    );

    if (!clipRes.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to verify checkout status with payment provider.",
        }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

    const statusData = await clipRes.json();

    if (statusData?.status !== "CHECKOUT_COMPLETED") {
      return new Response(
        JSON.stringify({
          error: "Notification is only sent for completed checkouts.",
        }),
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

    const adminNotification = buildAdminOrderNotificationEmail({
      paymentRequestId,
      receiptNo: statusData?.receipt_no,
      cart: safeCart,
      contact,
    });

    const { error } = await resend.emails.send({
      from,
      to,
      subject: adminNotification.subject,
      html: adminNotification.html,
      text: adminNotification.text,
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

    const adminEmailSent = true;
    let customerEmailSent = false;
    const customerEmail = contact?.email;

    if (customerEmail) {
      const confirmation = buildPurchaseConfirmationEmail({
        paymentRequestId,
        receiptNo: statusData?.receipt_no,
        cart: safeCart,
        contact,
      });

      const customerResult = await resend.emails.send({
        from,
        to: customerEmail,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      });

      if (customerResult?.error) {
        return new Response(
          JSON.stringify({
            error: "Customer confirmation email failed.",
            details: customerResult.error.message,
          }),
          {
            status: 502,
            headers: { "content-type": "application/json" },
          },
        );
      }

      customerEmailSent = true;
    }

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailSent,
        customerEmailSent,
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
