export const mockCheckoutResponse = {
  amount: 0.02,
  api_version: "2",
  created_at: "2026-04-18T01:08:17Z",
  currency: "MXN",
  expires_at: "2026-04-21T01:08:17Z",
  last_status_message: "The checkout link is completed successfully",
  modified_at: "2026-04-18T01:09:19Z",
  object_type: "payment_link",
  payment_id: "d57b6ebc-ca40-4fa7-98c5-df0b2cfd86db",
  payment_request_id: "0ae8778f-f84b-4e85-8317-d89dff8d2699",
  payment_request_url:
    "https://pago.clip.mx/v3/0ae8778f-f84b-4e85-8317-d89dff8d2699",
  purchase_description: "Compra en Tirando Vino",
  receipt_no: "PAsZJMmz",
  redirection_url: {
    success: "http://localhost:3000/purchase-success",
    error: "http://localhost:3000/purchase-success",
    default: "http://localhost:3000/purchase-success",
  },
  status: "CHECKOUT_COMPLETED",
};

export const mockCheckoutCartPayload = [
  {
    productId: "mock-wine-1",
    productName: "Malbec Reserva",
    quantity: 2,
    productPrice: 489,
  },
  {
    productId: "mock-merch-1",
    productName: "Sacacorchos Profesional",
    quantity: 1,
    productPrice: 249,
  },
  {
    productId: "mock-merch-2",
    productName: "Copas de Vino (set x2)",
    quantity: 1,
    productPrice: 320,
  },
];

export const mockCheckoutContactPayload = {
  name: "Tania Tenorio",
  email: "taniatenorio@hotmail.com",
  phone: "5512345678",
  address: "Av. Reforma 123",
  stateName: "CDMX",
  city: "Ciudad de Mexico",
  zip: "01000",
};
