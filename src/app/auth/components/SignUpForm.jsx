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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { signup } from "@/actions/auth/auth";
import { getAuthMessage } from "@/utils/authMessages";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignUpForm = ({ setTypeSelected, showFeedback }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const onSubmit = async (user) => {
    setIsLoading(true);

    try {
      const res = await signup(user);

      if (!res.success) {
        showFeedback(
          getAuthMessage(res.message, "Error al registrar el usuario."),
          "error",
        );
        return;
      }

      setTypeSelected("login");
      reset();
      showFeedback("Cuenta creada exitosamente. Ahora puedes iniciar sesion.");
    } catch (error) {
      showFeedback(
        getAuthMessage(error.message, "Error al registrar el usuario."),
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
      {/* Your signup form goes here */}
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: "0 auto" }}>
        <Typography variant="h5" component="h1" align="center">
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
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
            required
            fullWidth
            sx={{ mb: 2 }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
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
