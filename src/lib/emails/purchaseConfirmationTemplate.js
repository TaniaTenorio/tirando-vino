const formatMoney = (value) => {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)} MXN`;
};

const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const createCartRowsHtml = (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return `
      <tr>
        <td colspan="3" style="padding:12px 0;color:#6b7280;font-size:14px;">
          No se encontraron productos en la orden.
        </td>
      </tr>
    `;
  }

  return cart
    .map((item) => {
      const quantity = Number(item?.quantity || 0);
      const unitPrice = Number(item?.productPrice || 0);
      const lineTotal = quantity * unitPrice;

      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">
            ${escapeHtml(item?.productName || "Producto")}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#4b5563;text-align:center;">
            ${quantity}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;text-align:right;white-space:nowrap;">
            ${escapeHtml(formatMoney(lineTotal))}
          </td>
        </tr>
      `;
    })
    .join("");
};

export function buildPurchaseConfirmationEmail({
  paymentRequestId,
  receiptNo,
  cart,
  contact,
}) {
  const safeCart = Array.isArray(cart) ? cart : [];

  const total = safeCart.reduce(
    (acc, item) =>
      acc + Number(item?.productPrice || 0) * Number(item?.quantity || 0),
    0,
  );

  const customerName = contact?.name || "cliente";
  const orderDate = new Date().toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const subject = `Confirmacion de compra #${paymentRequestId}`;

  const html = `
    <div style="margin:0;padding:24px;background:#f7f7f5;font-family:Arial,sans-serif;color:#1f2937;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="padding:24px 28px;background:#152219;color:#ffffff;">
            <p style="margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Tirando Vino</p>
            <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;">Tu compra esta confirmada</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 28px 8px;">
            <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
              Hola ${escapeHtml(customerName)}, gracias por tu compra.
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;">
              Recibimos tu pedido correctamente. En breve nos pondremos en contacto para coordinar la entrega.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
              <tr>
                <td style="font-size:13px;color:#6b7280;padding:6px 0;">ID de compra</td>
                <td style="font-size:13px;color:#111827;padding:6px 0;text-align:right;">${escapeHtml(paymentRequestId || "N/A")}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b7280;padding:6px 0;">Recibo</td>
                <td style="font-size:13px;color:#111827;padding:6px 0;text-align:right;">${escapeHtml(receiptNo || "N/A")}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b7280;padding:6px 0;">Fecha</td>
                <td style="font-size:13px;color:#111827;padding:6px 0;text-align:right;">${escapeHtml(orderDate)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px 8px;">
            <h2 style="margin:0;font-size:16px;color:#111827;">Resumen del pedido</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th align="left" style="padding:10px 0;border-bottom:1px solid #d1d5db;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;color:#6b7280;">Producto</th>
                  <th align="center" style="padding:10px 0;border-bottom:1px solid #d1d5db;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;color:#6b7280;">Cant.</th>
                  <th align="right" style="padding:10px 0;border-bottom:1px solid #d1d5db;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;color:#6b7280;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${createCartRowsHtml(safeCart)}
              </tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 28px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size:14px;color:#111827;font-weight:700;">Total</td>
                <td style="font-size:16px;color:#111827;font-weight:700;text-align:right;white-space:nowrap;">${escapeHtml(formatMoney(total))}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px 28px;">
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              Si tienes alguna duda, responde a este correo y con gusto te ayudamos.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const lines = safeCart.map((item) => {
    const quantity = Number(item?.quantity || 0);
    const unitPrice = Number(item?.productPrice || 0);
    const lineTotal = quantity * unitPrice;
    return `- ${item?.productName || "Producto"} x${quantity}: ${formatMoney(lineTotal)}`;
  });

  const text = [
    "Tirando Vino",
    "",
    `Hola ${customerName},`,
    "Tu compra esta confirmada. Gracias por tu pedido.",
    "",
    `ID de compra: ${paymentRequestId || "N/A"}`,
    `Recibo: ${receiptNo || "N/A"}`,
    `Fecha: ${orderDate}`,
    "",
    "Resumen del pedido:",
    ...(lines.length > 0 ? lines : ["- Sin productos"]),
    "",
    `Total: ${formatMoney(total)}`,
    "",
    "Nos pondremos en contacto para coordinar la entrega.",
  ].join("\n");

  return {
    subject,
    html,
    text,
    total,
  };
}

export function buildAdminOrderNotificationEmail({
  paymentRequestId,
  receiptNo,
  cart,
  contact,
}) {
  const safeCart = Array.isArray(cart) ? cart : [];

  const total = safeCart.reduce(
    (acc, item) =>
      acc + Number(item?.productPrice || 0) * Number(item?.quantity || 0),
    0,
  );

  const orderDate = new Date().toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const customerName = contact?.name || "N/A";
  const customerEmail = contact?.email || "N/A";
  const customerPhone = contact?.phone || "N/A";
  const customerAddress = contact?.address || "N/A";
  const customerState = contact?.stateName || "N/A";
  const customerCity = contact?.city || "N/A";
  const customerZip = contact?.zip || "N/A";

  const subject = `Nueva orden para envio #${paymentRequestId}`;

  const html = `
    <div style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="padding:20px 24px;background:#1f2937;color:#ffffff;">
            <p style="margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.9;">Tirando Vino · Admin</p>
            <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;">Nueva orden para preparar envio</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:18px 24px 10px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;">
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">ID de compra</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;text-align:right;">${escapeHtml(paymentRequestId || "N/A")}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Recibo</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;text-align:right;">${escapeHtml(receiptNo || "N/A")}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Fecha</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;text-align:right;">${escapeHtml(orderDate)}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Total</td>
                <td style="padding:10px 12px;font-size:14px;color:#111827;text-align:right;font-weight:700;">${escapeHtml(formatMoney(total))}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:6px 24px 8px;">
            <h2 style="margin:0;font-size:16px;color:#111827;">Datos del cliente</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:8px;">
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Nombre</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;">${escapeHtml(customerName)}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Correo</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;">${escapeHtml(customerEmail)}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Telefono</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;">${escapeHtml(customerPhone)}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Direccion</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;">${escapeHtml(customerAddress)}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">Ciudad / Estado</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;">${escapeHtml(`${customerCity} / ${customerState}`)}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;color:#6b7280;">CP</td>
                <td style="padding:10px 12px;font-size:13px;color:#111827;">${escapeHtml(customerZip)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 8px;">
            <h2 style="margin:0;font-size:16px;color:#111827;">Productos a enviar</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th align="left" style="padding:10px 0;border-bottom:1px solid #d1d5db;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;color:#6b7280;">Producto</th>
                  <th align="center" style="padding:10px 0;border-bottom:1px solid #d1d5db;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;color:#6b7280;">Cant.</th>
                  <th align="right" style="padding:10px 0;border-bottom:1px solid #d1d5db;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;color:#6b7280;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${createCartRowsHtml(safeCart)}
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  const lines = safeCart.map((item) => {
    const quantity = Number(item?.quantity || 0);
    const unitPrice = Number(item?.productPrice || 0);
    const lineTotal = quantity * unitPrice;
    return `- ${item?.productName || "Producto"} x${quantity}: ${formatMoney(lineTotal)}`;
  });

  const text = [
    "Tirando Vino - Nueva orden para envio",
    "",
    `ID de compra: ${paymentRequestId || "N/A"}`,
    `Recibo: ${receiptNo || "N/A"}`,
    `Fecha: ${orderDate}`,
    `Total: ${formatMoney(total)}`,
    "",
    "Datos del cliente:",
    `- Nombre: ${customerName}`,
    `- Correo: ${customerEmail}`,
    `- Teléfono: ${customerPhone}`,
    `- Dirección: ${customerAddress}`,
    `- Ciudad: ${customerCity}`,
    `- Estado: ${customerState}`,
    `- CP: ${customerZip}`,
    "",
    "Productos a enviar:",
    ...(lines.length > 0 ? lines : ["- Sin productos"]),
  ].join("\n");

  return {
    subject,
    html,
    text,
    total,
  };
}
