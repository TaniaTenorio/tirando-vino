"use client";

import React from "react";
import { Button } from "@mui/material";
import { CURRENCY } from "@/utils/constants";
export default function PayButton({
  totalPrice,
  contactForm,
  disabled = false,
  fullWidth = false,
  label = "Ir a Pagar",
}) {
  const handleOnPay = async (event) => {
    event?.stopPropagation();

    if (contactForm) {
      try {
        window.localStorage.setItem(
          "tv-client-contact",
          JSON.stringify(contactForm),
        );
      } catch {
        // Ignore local storage write failures.
      }
    }

    const paymentData = {
      amount: totalPrice,
      currency: CURRENCY,
      purchase_description: "Compra en Tirando Vino",
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("Checkout error:", json.error || json);
        return;
      }

      if (json.payment_request_id) {
        try {
          window.localStorage.setItem(
            "tv-payment-request-id",
            json.payment_request_id,
          );
        } catch {
          // Ignore local storage write failures.
        }
      }

      if (json.payment_request_url) {
        window.location.href = json.payment_request_url;
      }
    } catch (err) {
      console.error("Checkout request failed:", err);
    }
  };

  return (
    <Button
      onClick={handleOnPay}
      fullWidth={fullWidth}
      variant="contained"
      disabled={disabled || totalPrice <= 0}
      sx={{ margin: "0 8px", fontWeight: "bold" }}
    >
      {label}
    </Button>
  );
}
