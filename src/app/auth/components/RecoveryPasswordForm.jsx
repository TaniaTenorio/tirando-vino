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
import { sendRecoveryEmail } from "@/actions/auth/auth";

const RecoverPasswordForm = ({ setTypeSelected }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  // ============ Password Recovery ===========
  const onSubmit = async (user) => {
    setIsLoading(true);

    try {
      console.log(user);
      const res = await sendRecoveryEmail(user);

      if (res.success) {
        // TODO: add toast notification
        console.log("Correo de recuperación enviado exitosamente");
        setTypeSelected("login");
      }
    } catch (error) {
      // TODO: add toast notification with error message
      console.log(error.message || "Error al enviar el correo de recuperación");
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
          Recuperar contraseña
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Te enviaremos un correo para recuperar tu contraseña.
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
            name="email"
            required
            fullWidth
            sx={{ mb: 2 }}
            {...register("email")}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Recuperar contraseña
          </Button>
          <Box>
            <Button variant="text" onClick={() => setTypeSelected("login")}>
              Volver al login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecoverPasswordForm;
