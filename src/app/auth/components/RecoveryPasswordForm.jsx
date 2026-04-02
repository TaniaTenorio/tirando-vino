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
import { sendRecoveryEmail } from "@/actions/auth/auth";
import { getAuthMessage } from "@/utils/authMessages";

const RecoverPasswordForm = ({ setTypeSelected, showFeedback }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit } = useForm();

  // ============ Password Recovery ===========
  const onSubmit = async (user) => {
    setIsLoading(true);

    try {
      const res = await sendRecoveryEmail(user);

      if (res.success) {
        showFeedback(res.message);
        setTypeSelected("login");
      } else {
        showFeedback(
          getAuthMessage(
            res.message,
            "Error al enviar el correo de recuperación.",
          ),
          "error",
        );
      }
    } catch (error) {
      showFeedback(
        getAuthMessage(
          error.message,
          "Error al enviar el correo de recuperación.",
        ),
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
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Recuperar contraseña"}
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
