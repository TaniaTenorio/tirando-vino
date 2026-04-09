"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import WinesTable from "./components/WinesTable";
import MerchTable from "./components/MerchTable";
import HousesTable from "./components/HousesTable";
import styles from "./admin.module.css";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./components/Navbar";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPage = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [wines, setWines] = React.useState([]);
  const [merch, setMerch] = React.useState([]);
  const [houses, setHouses] = React.useState([]);
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [dataError, setDataError] = React.useState("");

  const { user, isLoading, getUserData } = useAuth();
  const [tabValue, setTabValue] = React.useState(0);
  const [filterArg, setFilterArg] = React.useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    if (!user && !isLoading) {
      getUserData();
    }
  }, [getUserData, isLoading, user]);

  const loadAdminData = React.useCallback(async () => {
    setIsDataLoading(true);
    setDataError("");

    try {
      const [wineResponse, merchResponse, houseResponse] = await Promise.all([
        fetch("/api/admin/wine"),
        fetch("/api/admin/merch"),
        fetch("/api/admin/house"),
      ]);

      if (!wineResponse.ok || !merchResponse.ok || !houseResponse.ok) {
        throw new Error(
          "No se pudo cargar la informacion del panel de administrador.",
        );
      }

      const [wineData, merchData, houseData] = await Promise.all([
        wineResponse.json(),
        merchResponse.json(),
        houseResponse.json(),
      ]);

      setWines(wineData);
      setMerch(merchData);
      setHouses(houseData);
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
      <Header
        userImage={"https://via.placeholder.com/150"}
        onLogout={handleLogout}
      />
      <div className={styles.page}>
        <h1>Hola {user.name}! Este es tu panel de administrador.</h1>
        <Navbar value={tabValue} handleOnChange={handleTabChange} />
        <CustomTabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Lista de Vinos
          </Typography>
          <WinesTable initialRows={wines} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Merch
          </Typography>
          <MerchTable initialRows={merch} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Bodegas
          </Typography>
          <HousesTable initialRows={houses} />
        </CustomTabPanel>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </Button>
      </div>
    </>
  );
};

export default AdminPage;
