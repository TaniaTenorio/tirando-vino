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
import { useForm } from "react-hook-form";
import { signup } from "@/actions/auth/auth";

const SignUpForm = ({ setTypeSelected }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (user) => {
    // console.log("Form submitted", user);
    setIsLoading(true);

    try {
      const res = await signup(user);
      console.log("RES", res);

      if (res.success) {
        console.log("Usuario registrado exitosamente");
      }

      setTypeSelected("login");
      reset();
    } catch (error) {
      // Manejar errores específicos de Supabase
      if (error.message.includes("User already registered")) {
        console.log("Este correo electrónico ya está registrado");
      } else if (
        error.message.includes("Password should be at least 6 characters")
      ) {
        console.log("La contraseña debe tener al menos 6 caracteres");
      } else if (error.message.includes("Invalid email")) {
        console.log("Por favor ingresa un correo electrónico válido");
      } else {
        console.log(error.message || "Error al registrar el usuario");
      }
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
      {/* Your signup form goes here */}
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: "0 auto" }}>
        <Typography variant="h5" component="div" align="center">
          Crear cuenta
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Crea una cuenta para acceder a la aplicación.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <InputLabel htmlFor="name">Nombre</InputLabel>
          <OutlinedInput
            type="text"
            id="name"
            name="name"
            required
            fullWidth
            sx={{ mb: 2 }}
            {...register("name")}
          />
          <InputLabel htmlFor="email">Correo</InputLabel>
          <OutlinedInput
            type="email"
            id="email"
            name="email"
            required
            fullWidth
            sx={{ mb: 2 }}
            {...register("email")}
          />
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <OutlinedInput
            type="password"
            id="password"
            name="password"
            {...register("password")}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Registrarse
          </Button>
          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              ¿Ya tienes una cuenta?{" "}
              <Button variant="text" onClick={() => setTypeSelected("login")}>
                Inicia sesión
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpForm;
