"use client";

import React from "react";
import { Box } from "@mui/material";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import RecoveryPasswordForm from "./RecoveryPasswordForm";
import CustomSnackbar from "@/app/components/Snackbar";

const AuthForm = ({ type }) => {
  const [typeSelected, setTypeSelected] = React.useState(type);

  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showFeedback = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      severity,
      message,
    });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  return (
    <>
      <Box>
        {typeSelected === "login" && (
          <LoginForm
            setTypeSelected={setTypeSelected}
            showFeedback={showFeedback}
          />
        )}
        {typeSelected === "signup" && (
          <SignUpForm
            setTypeSelected={setTypeSelected}
            showFeedback={showFeedback}
          />
        )}
        {typeSelected === "reset" && (
          <RecoveryPasswordForm
            setTypeSelected={setTypeSelected}
            showFeedback={showFeedback}
          />
        )}
      </Box>
      <CustomSnackbar
        open={snackbarState.open}
        handleOnClose={handleSnackbarClose}
        severity={snackbarState.severity}
        message={snackbarState.message}
      />
    </>
  );
};

export default AuthForm;
