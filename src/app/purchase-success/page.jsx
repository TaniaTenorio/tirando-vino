"use client";

import React from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const mockResponse = {
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

export default function PurchaseSuccessPage() {
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => {
    // Keep this structure visible while integrating the final status model.
    void mockResponse;

    // Load cart from localStorage.
    let cartItems = [];
    try {
      const storedCart = window.localStorage.getItem("tv-cart");
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          cartItems = parsed;
          setCart(parsed);
        }
      }
    } catch {
      // Ignore malformed storage data.
    }

    const sendCompletedPurchaseEmail = async (statusData) => {
      const paymentRequestId = statusData?.payment_request_id;

      if (!paymentRequestId) return;

      const sentFlagKey = `tv-email-sent-${paymentRequestId}`;
      const alreadySent = window.localStorage.getItem(sentFlagKey) === "1";
      if (alreadySent) return;

      let contact = null;
      try {
        const savedContact = window.localStorage.getItem("tv-client-contact");
        if (savedContact) {
          contact = JSON.parse(savedContact);
        }
      } catch {
        // Ignore malformed contact data.
      }

      try {
        const res = await fetch("/api/checkout/notify", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statusData,
            cart: cartItems,
            contact,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(
            "Failed to send purchase notification email:",
            errorData,
          );
          return;
        }

        window.localStorage.setItem(sentFlagKey, "1");
        console.log("Purchase notification email sent from server route.");
      } catch (error) {
        console.error("Failed to send purchase notification email:", error);
      }
    };

    // Check payment status via server-side proxy.
    const checkPaymentStatus = async () => {
      try {
        const paymentRequestId = window.localStorage.getItem(
          "tv-payment-request-id",
        );
        if (!paymentRequestId) return;

        const res = await fetch(
          `/api/checkout/status?id=${encodeURIComponent(paymentRequestId)}`,
        );
        const data = await res.json();
        console.log("Payment status:", data);

        if (data?.status === "CHECKOUT_COMPLETED") {
          await sendCompletedPurchaseEmail(data);
        }
      } catch (err) {
        console.error("Failed to fetch payment status:", err);
      }
    };

    void checkPaymentStatus();
  }, []);

  const subtotal = cart
    .reduce((acc, item) => acc + item.productPrice * item.quantity, 0)
    .toFixed(2);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 6,
        gap: 3,
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />

      <Typography variant="h5" fontWeight="bold" textAlign="center">
        ¡Gracias por tu compra!
      </Typography>

      <Typography variant="body1" textAlign="center" color="text.secondary">
        En los próximos días nos pondremos en contacto para agendar la entrega
        de tus productos.
      </Typography>

      {cart.length > 0 && (
        <Box
          sx={{
            width: "100%",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <List disablePadding>
            {cart.map((item, index) => (
              <React.Fragment key={item.productId}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{ py: 1.5, px: 2 }}
                  secondaryAction={
                    <Typography variant="body2" color="text.secondary">
                      ${(item.productPrice * item.quantity).toFixed(2)}
                    </Typography>
                  }
                >
                  <ListItemText
                    primary={item.productName}
                    secondary={`Cantidad: ${item.quantity} × $${item.productPrice?.toFixed(2)}`}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: "medium",
                    }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              bgcolor: "action.hover",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              ${subtotal} MXN
            </Typography>
          </Box>
        </Box>
      )}

      <Button
        variant="contained"
        size="large"
        href="/"
        sx={{ mt: 1, fontWeight: "bold", borderRadius: 2 }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
}
