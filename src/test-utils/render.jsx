import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";

const Providers = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export const renderWithProviders = (ui, options) =>
  render(ui, {
    wrapper: Providers,
    ...options,
  });
