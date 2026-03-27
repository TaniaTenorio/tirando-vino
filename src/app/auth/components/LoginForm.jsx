"use client";

import React from "react";
import {
  Box,
  CardContent,
  Container,
  InputLabel,
  Paper,
  OutlinedInput,
  Typography,
  Button,
} from "@mui/material";

const LoginForm = ({ setTypeSelected }) => {
  const handleSubmit = () => {
    console.log("Form submitted");
    // Here you would typically handle the form submission,
    // e.g., by sending the data to your authentication API.
  };

  return (
    <Container
      sx={{
        height: "100vh",
        alignContent: "center",
      }}
    >
      {/* Your login form goes here */}
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: "0 auto" }}>
        <Typography variant="h5" component="div" align="center">
          Login
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Ingresa tus credenciales para acceder a tu cuenta.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <InputLabel htmlFor="email">Correo</InputLabel>
          <OutlinedInput
            type="email"
            id="email"
            name="email"
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <OutlinedInput
            type="password"
            id="password"
            name="password"
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="text"
            onClick={() => setTypeSelected("reset")}
            sx={{ alignSelf: "flex-end" }}
          >
            ¿Olvidaste tu contraseña?
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Ingresar
          </Button>
          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              ¿No tienes una cuenta?{" "}
              <Button variant="text" onClick={() => setTypeSelected("signup")}>
                Regístrate
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
