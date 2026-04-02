"use client";

import React from "react";
import {
  Box,
  Container,
  InputLabel,
  Paper,
  OutlinedInput,
  Typography,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { login } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";
import { getAuthMessage } from "@/utils/authMessages";

const LoginForm = ({ setTypeSelected, showFeedback }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await login(data);

      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        showFeedback(
          getAuthMessage(res.message, "Error al iniciar sesion."),
          "error",
        );
      }
    } catch (error) {
      showFeedback(
        getAuthMessage(error.message, "Error al iniciar sesion."),
        "error",
      );
    } finally {
      setIsLoading(false);
    }
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <InputLabel htmlFor="email">Correo</InputLabel>
          <OutlinedInput
            type="email"
            id="email"
            {...register("email")}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <OutlinedInput
            type="password"
            id="password"
            {...register("password")}
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
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
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
