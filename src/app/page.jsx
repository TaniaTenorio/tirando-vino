"use client";

import * as React from "react";
import Image from "next/image";

import styles from "./page.module.css";
import data from "./database.json";
import merchData from "./merchdb.json";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Header from "./components/Header";
import WineCard from "./components/WineCard";
import Hero from "./components/Hero";
import PropTypes from "prop-types";
import RadioFilters from "./components/RadioFilters";
import Navbar from "./components/Navbar";
import CustomSnackbar from "./components/Snackbar";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [tabValue, setTabvalue] = React.useState(0);
  const [filterArg, setFilterArg] = React.useState("TODOS");
  const [cart, setCart] = React.useState([]);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [wineHouse, setWineHouse] = React.useState("TODOS");

  const handleRadioChange = (event) => {
    console.log(event.target.value);
    setWineHouse(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setTabvalue(newValue);
    setFilterArg(event.target.innerText);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const onCartButtonPressed = (newItem) => {
    // Check if the item already exists in the cart
    const itemExists = cart.some(
      (cartItem) => cartItem.productId === newItem.productId,
    );

    if (itemExists) {
      // If the item exists, update its quantity
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.productId === newItem.productId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      // If the item does not exist, add it to the cart with quantity 1
      newItem.quantity = 1;
      setCart((prevCart) => [...prevCart, newItem]);
    }

    setOpenSnackBar(true);
  };

  const handleRemoveItem = (item) => {
    setCart((prevCartList) =>
      prevCartList.filter((cartItem) => cartItem.productId !== item),
    );
  };

  const handleUpdateCartList = (item, action) => {
    console.log("UPDATE CART LIST", item, action);
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
  };

  const handleMerchCartButton = (el) => {
    const data = {
      productId: el.id,
      productName: el.name,
      productPrice: el.price,
      productImg: el.imageURL,
      productCategory: "merch",
      productVariety: el.variety,
    };
    onCartButtonPressed(data);
  };

  // React.useEffect(() => {
  //   if (filterArg === "TODOS") {
  //     setFilteredData(data);
  //   } else if (filterArg !== "TODOS") {
  //     console.log("ELSE IF");
  //     const result = data.filter((el) => el.color.toUpperCase() === filterArg);
  //     setFilteredData(result);
  //   }
  // }, [data, filterArg]);

  // React.useEffect(() => {
  //   let filtered = data;
  //   if (wineHouse !== "") {
  //     if (wineHouse === "TODOS") {
  //       setFilteredData(data);
  //       return;
  //     }
  //     filtered = filtered.filter((item) => item.house === wineHouse);
  //     setFilteredData(filtered);
  //   }
  // }, [wineHouse]);

  const filteredData = React.useMemo(() => {
    let result = data;

    if (wineHouse !== "" && wineHouse !== "TODOS") {
      result = result.filter((item) => item.house === wineHouse);
    }

    if (filterArg !== "TODOS") {
      result = result.filter((el) => el.color.toUpperCase() === filterArg);
    }

    // If wineHouse is "", return empty array
    if (wineHouse === "") return [];

    return result;
  }, [data, wineHouse, filterArg]);

  return (
    <div className={styles.page}>
      <Header
        cartList={cart}
        onRemoveItem={handleRemoveItem}
        onUpdateCartList={handleUpdateCartList}
      />
      <Hero />
      <main className={styles.mainContent}>
        <Navbar value={tabValue} handleOnChange={handleChange} />
        <article className={styles.winesSection}>
          <section className={styles.winesList}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 5, sm: 3, md: 3 }} className="country-filter">
                <RadioFilters
                  wineHouse={wineHouse}
                  handleOnChange={handleRadioChange}
                />
                <Divider />
              </Grid>
              <Grid size={{ xs: 7, sm: 9, md: 9 }}>
                <CustomTabPanel value={tabValue} index={0}>
                  <Grid container spacing={2} className={styles.cardContainer}>
                    {filteredData.map((el, index) => (
                      <Grid key={index}>
                        <WineCard
                          id={el.id}
                          name={el.name}
                          house={el.house}
                          variety={el.variety}
                          year={el.year}
                          color={el.color}
                          country={el.country}
                          region={el.region}
                          price={el.price}
                          imageSrc={el.imageURL}
                          handleCartButton={onCartButtonPressed}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CustomTabPanel>
              </Grid>
            </Grid>
          </section>
        </article>
        <article>
          <section>
            <div className={styles.sectionHeader}>
              <Typography align="center" color="black" variant="h6">
                {" "}
                Llévate una playerita
              </Typography>
            </div>
            <div className={styles.merchContainer}>
              <Grid container spacing={2}>
                {merchData.map((el) => (
                  <Grid key={el.id}>
                    <Card>
                      <CardContent>
                        <Image
                          src={el.imageURL}
                          width={300}
                          height={300}
                          alt="t-shirt"
                        />
                        <Typography align="center">{el.name}</Typography>
                        <Typography align="center">
                          Talla {el.variety.toUpperCase()}
                        </Typography>
                        <Typography align="center">${el.price} MXN</Typography>
                        <CardActions style={{ justifyContent: "center" }}>
                          <Button
                            size="small"
                            onClick={() => handleMerchCartButton(el)}
                            variant="contained"
                          >
                            Agregar al carrito
                          </Button>
                        </CardActions>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          </section>
        </article>
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
        severity="success"
        message="Haz agregado un producto a tu carrito"
      />
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number,
};
