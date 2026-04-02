"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import WinesTable from "./components/WinesTable";
import MerchTable from "./components/MerchTable";
import styles from "./admin.module.css";
import { useAuth } from "@/context/AuthContext";

const AdminPage = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [wines, setWines] = React.useState([]);
  const [merch, setMerch] = React.useState([]);
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [dataError, setDataError] = React.useState("");

  const { user, isLoading, getUserData } = useAuth();

  React.useEffect(() => {
    if (!user && !isLoading) {
      getUserData();
    }
  }, [getUserData, isLoading, user]);

  const loadAdminData = React.useCallback(async () => {
    setIsDataLoading(true);
    setDataError("");

    try {
      const [wineResponse, merchResponse] = await Promise.all([
        fetch("/api/admin/wine"),
        fetch("/api/admin/merch"),
      ]);

      if (!wineResponse.ok || !merchResponse.ok) {
        throw new Error(
          "No se pudo cargar la informacion del panel de administrador.",
        );
      }

      const [wineData, merchData] = await Promise.all([
        wineResponse.json(),
        merchResponse.json(),
      ]);

      setWines(wineData);
      setMerch(merchData);
    } catch (error) {
      console.error("Error loading admin data:", error);
      setDataError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la informacion del panel de administrador.",
      );
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    loadAdminData();
  }, [loadAdminData, user]);

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  if (isLoading || isDataLoading || !user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Cargando panel de administrador...</Typography>
      </Box>
    );
  }

  if (dataError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="h5">
          No se pudo cargar el panel de administrador
        </Typography>
        <Typography color="text.secondary">{dataError}</Typography>
        <Button variant="contained" onClick={loadAdminData}>
          Intentar de nuevo
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Navbar
        userImage={"https://via.placeholder.com/150"}
        onLogout={handleLogout}
      />
      <div className={styles.page}>
        <h1>Welcome to the Admin Dashboard, {user.name}!</h1>
        <Typography variant="h5" gutterBottom>
          Lista de Vinos
        </Typography>
        <WinesTable initialRows={wines} />
        <Typography variant="h5" gutterBottom>
          Merch
        </Typography>
        <MerchTable initialRows={merch} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </>
  );
};

export default AdminPage;
