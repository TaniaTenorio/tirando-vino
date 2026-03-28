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
import { updatePassword } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";

const UpdatePasswordPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log(data);
      const res = await updatePassword(data);

      if (res.success) {
        console.log("Contraseña actualizada exitosamente");
        // TODO: add toast notification
        router.push("/admin");
      }
    } catch (error) {
      // TODO: add toast notification with error message
      console.log(error.message || "Error al actualizar la contraseña");
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
          Nueva contraseña
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Ingresa tu nueva contraseña.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column" }}
        >
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
          <InputLabel htmlFor="confirmPassword">
            Confirmar contraseña
          </InputLabel>
          <OutlinedInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            {...register("confirmPassword")}
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
            Actualizar contraseña
          </Button>
          <Box>
            <Button variant="text" href="/login">
              Volver al login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdatePasswordPage;
