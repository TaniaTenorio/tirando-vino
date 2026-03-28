"use client";

import React from "react";
import { Box } from "@mui/material";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import RecoveryPasswordForm from "./RecoveryPasswordForm";

const AuthForm = ({ type }) => {
  const [typeSelected, setTypeSelected] = React.useState(type);
  return (
    <Box>
      {typeSelected === "login" && (
        <LoginForm setTypeSelected={setTypeSelected} />
      )}
      {typeSelected === "signup" && (
        <SignUpForm setTypeSelected={setTypeSelected} />
      )}
      {typeSelected === "reset" && (
        <RecoveryPasswordForm setTypeSelected={setTypeSelected} />
      )}
    </Box>
  );
};

export default AuthForm;
