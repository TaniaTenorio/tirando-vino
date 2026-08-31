"use client";

import React from "react";
import styles from "../page.module.css";
import { Typography, Box } from "@mui/material";
import PropTypes from "prop-types";
import {
  Header,
  Hero,
  HomeWinesSection,
  HomeMerchSection,
  CustomSnackbar,
  Modal,
} from "./index";
import { useAgeGate } from "@/hooks/useAgeGate";

const CART_STORAGE_KEY = "tv-cart";

const HomeClient = ({ winesData, merchData }) => {
  const [tabValue, setTabvalue] = React.useState(0);
  const [filterArg, setFilterArg] = React.useState("TODOS");
  const [openCart, setOpenCart] = React.useState(false);
  const [cart, setCart] = React.useState([]);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [wineHouse, setWineHouse] = React.useState("TODOS");
  const { ageGateStatus, handleAgeAccepted, handleAgeRejected } = useAgeGate();
  const hasHydratedCart = React.useRef(false);

  React.useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch {
      // Ignore malformed or inaccessible local storage data.
    } finally {
      hasHydratedCart.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (!hasHydratedCart.current) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore local storage write failures.
    }
  }, [cart]);

  const houseOptions = React.useMemo(() => {
    const seen = new Set();

    return winesData
      .filter((item) => item?.house)
      .map((item) => ({
        value: item.house,
        label: item.houseName || item.house,
      }))
      .filter((item) => {
        if (seen.has(item.value)) return false;
        seen.add(item.value);
        return true;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [winesData]);

  const colorTabs = React.useMemo(() => {
    const seen = new Set();

    return winesData
      .map((item) => item?.color)
      .filter((color) => {
        if (!color) return false;

        const normalized = String(color).trim();
        if (!normalized) return false;

        const key = normalized.toUpperCase();
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
      })
      .map((color) => String(color).trim())
      .sort((a, b) => a.localeCompare(b));
  }, [winesData]);

  const handleRadioChange = React.useCallback((event) => {
    setWineHouse(event.target.value);
  }, []);

  const handleChange = React.useCallback(
    (event, newValue) => {
      setTabvalue(newValue);

      if (newValue === 0) {
        setFilterArg("TODOS");
        return;
      }

      const selectedColor = colorTabs[newValue - 1];
      setFilterArg(selectedColor ? selectedColor.toUpperCase() : "TODOS");
    },
    [colorTabs],
  );

  const handleSnackbarClose = React.useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  }, []);

  const handleAddToCart = React.useCallback((newItem) => {
    setCart((prevCart) => {
      const itemExists = prevCart.some(
        (cartItem) => cartItem.productId === newItem.productId,
      );

      if (itemExists) {
        return prevCart.map((cartItem) =>
          cartItem.productId === newItem.productId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...prevCart, { ...newItem, quantity: 1 }];
    });
    setOpenSnackBar(true);
  }, []);

  const handleRemoveItem = React.useCallback((item) => {
    setCart((prevCartList) =>
      prevCartList.filter((cartItem) => cartItem.productId !== item.productId),
    );
  }, []);

  const handleUpdateCartList = React.useCallback((item, action) => {
    setCart((prevCartList) =>
      prevCartList.map((cartItem) => {
        if (cartItem.productId === item) {
          if (action === "plus") {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          } else if (action === "minus" && cartItem.quantity > 1) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          }
        }
        return cartItem;
      }),
    );
  }, []);

  const toggleCart = React.useCallback((newOpen) => {
    setOpenCart(newOpen);
  }, []);

  const filteredData = React.useMemo(() => {
    let result = winesData;

    if (wineHouse !== "" && wineHouse !== "TODOS") {
      result = result.filter((item) => item.house === wineHouse);
    }

    if (filterArg !== "TODOS") {
      result = result.filter((el) => el.color.toUpperCase() === filterArg);
    }

    if (wineHouse === "") return [];

    return result;
  }, [winesData, wineHouse, filterArg]);

  if (ageGateStatus === "pending") {
    return null;
  }

  if (ageGateStatus === "rejected") return null;

  return (
    <div className={styles.page}>
      <Header
        cartList={cart}
        onRemoveItem={handleRemoveItem}
        onUpdateCartList={handleUpdateCartList}
        onCartButtonPressed={toggleCart}
        openCart={openCart}
      />
      <Hero />

      <main className={styles.mainContent}>
        <HomeWinesSection
          tabValue={tabValue}
          onTabChange={handleChange}
          colorTabs={colorTabs}
          wineHouse={wineHouse}
          onHouseChange={handleRadioChange}
          houseOptions={houseOptions}
          filteredData={filteredData}
          onAddToCart={handleAddToCart}
        />
        <HomeMerchSection merchData={merchData} onAddToCart={handleAddToCart} />
      </main>

      <footer className={styles.footer}>
        <Box>
          <Typography variant="body2" color="textSecondary" align="center">
            {"© "}
            Tirando Vino {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </footer>

      <CustomSnackbar
        open={openSnackBar}
        handleOnClose={handleSnackbarClose}
        actionOnClick={() => toggleCart(true)}
        severity="success"
        message="Haz agregado un producto a tu carrito"
        actionLabel="Ver carrito"
      />

      <Modal
        isOpen={ageGateStatus === "unknown"}
        title="¿Eres mayor de 18 años?"
        content="Para continuar navegando en Tirando Vino, necesitamos confirmar que tienes 18 años o más."
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
        }}
        actions={[
          {
            label: "No, soy menor de 18",
            color: "error",
            onClick: handleAgeRejected,
          },
          {
            label: "Sí, soy mayor de 18",
            color: "primary",
            onClick: handleAgeAccepted,
          },
        ]}
      />
    </div>
  );
};

HomeClient.propTypes = {
  winesData: PropTypes.array.isRequired,
  merchData: PropTypes.array.isRequired,
};

export default HomeClient;
