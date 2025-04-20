"use client";
import { createTheme } from "@mui/material/styles";
import { Shadows_Into_Light } from "next/font/google";

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows-into-light",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-shadows-into-light)",
  },
  palette: {
    primary: {
      main: "#c69e0b",
    },
    secondary: {
      main: "#c1bdbd",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
  },
});

export default theme;
