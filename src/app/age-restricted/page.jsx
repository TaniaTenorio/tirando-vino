"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function AgeRestrictedPage() {
  const isDev = process.env.NODE_ENV !== "production";

  const handleDevReset = async () => {
    try {
      await fetch("/api/age-gate", { method: "DELETE" });
    } catch {
      // Ignore network errors and still navigate.
    }

    window.location.replace("/");
  };

  return (
    <main>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 3,
          gap: 2,
        }}
      >
        <Typography variant="h3" component="h1">
          Acceso restringido
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 640 }}>
          Este sitio solo está disponible para personas mayores de 18 años. La
          venta de alcohol a menores de edad está prohibida.
        </Typography>

        {isDev ? (
          <Button variant="outlined" onClick={handleDevReset}>
            Resetear validación (solo desarrollo)
          </Button>
        ) : null}
      </Box>
    </main>
  );
}
