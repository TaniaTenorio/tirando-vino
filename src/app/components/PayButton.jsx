"use client";

import React from "react";
import { Button } from "@mui/material";
import { CURRENCY } from "@/utils/constants";

export default function PayButton({ totalAmount }) {
  const handleOnClick = async (event) => {
    event.stopPropagation();

    const paymentData = {
      amount: totalAmount,
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

      if (json.payment_request_url) {
        window.location.href = json.payment_request_url;
      }
    } catch (err) {
      console.error("Checkout request failed:", err);
    }
  };

  return (
    <Button
      onClick={handleOnClick}
      fullWidth
      variant="contained"
      disabled={totalAmount <= 0}
    >
      Ir a Pagar
    </Button>
  );
}
