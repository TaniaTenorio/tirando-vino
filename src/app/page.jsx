"use client";

import * as React from "react";

import styles from "./page.module.css";
import data from "./database.json";
import { Typography, Box } from "@mui/material";
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
      // hidden={value !== index}
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
  const [filteredData, setFilteredData] = React.useState(data);
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
    setCart((prevItems) => [...prevItems, newItem]);
    setOpenSnackBar(true);
    console.log("add to cart", newItem);
  };

  const handleRemoveItem = (event) => {
    // event.stopPropagation();
    // setCart((prevItems) => prevItems.filter((_, index) => index !== itemIndex));
    console.log("remove item at index:", event);
  };

  React.useEffect(() => {
    if (filterArg === "TODOS") {
      setFilteredData(data);
    } else if (filterArg !== "TODOS") {
      console.log("ELSE IF");
      const result = data.filter((el) => el.color.toUpperCase() === filterArg);
      setFilteredData(result);
    }
  }, [data, filterArg]);

  React.useEffect(() => {
    let filtered = data;
    if (wineHouse !== "") {
      if (wineHouse === "TODOS") {
        setFilteredData(data);
        return;
      }
      filtered = filtered.filter((item) => item.house === wineHouse);
      setFilteredData(filtered);
    }
  }, [wineHouse]);

  return (
    <div className={styles.page}>
      <Header cartList={cart} handleRemoveItem={handleRemoveItem} />
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
