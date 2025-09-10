"use client";

import Image from "next/image";
import styles from "./page.module.css";
import data from "./database.json";
import { Typography, Snackbar, Alert } from "@mui/material";
import { amber } from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Header from "./components/Header";
import WineCard from "./components/WineCard";
import Hero from "./components/Hero";
import PropTypes from "prop-types";
import { COUNTRIES, WINERIES } from "@/utils/constants";

const primary = amber[500];

const wineHouses = [
  { name: "bruma", label: "Bruma" },
  { name: "burbujasPop", label: "Burbujas Pop" },
  { name: "carrodilla", label: "Carrodilla" },
  { name: "casaAnza", label: "Casa Anza" },
  { name: "cercaBlanca", label: "Cerca Blanca" },
  { name: "fincaTre", label: "Finca Tre" },
  { name: "lechuza", label: "Lechuza" },
  { name: "lomita", label: "Lomita" },
  { name: "misionesDeCalifornia", label: "Misiones de California" },
  { name: "vinim", label: "Vinim" },
];

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const drawerWidth = 240;

export default function Home() {
  const [value, setValue] = React.useState(0);
  const [filterArg, setFilterArg] = React.useState("TODOS");
  const [filteredData, setFilteredData] = React.useState(data);
  const [cart, setCart] = React.useState([]);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [checkBoxState, setCheckBoxState] = React.useState({
    ...Object.fromEntries(Object.keys(COUNTRIES).map((key) => [key, false])),
    ...Object.fromEntries(Object.keys(WINERIES).map((key) => [key, false])),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFilterArg(event.target.innerText);
  };

  const handleCheckChange = (event) => {
    setCheckBoxState({
      ...checkBoxState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
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
    Object.entries(checkBoxState).forEach(([key, isChecked]) => {
      console.log(key, isChecked);
      if (isChecked) {
        filtered = filtered.filter(
          (item) => item.country === key || item.house === key,
        );
      }
    });
    setFilteredData(filtered);
  }, [checkBoxState]);

  const onCartButtonPressed = (newItem) => {
    setCart((prevItems) => [...prevItems, newItem]);
    setOpenSnackBar(true);
    console.log(newItem);
  };
  return (
    <div className={styles.page}>
      <Header cartList={cart} />
      <Hero />
      <main style={{ width: "100%" }}>
        <div className={styles.navbar}>
          <Typography align="center" color="black" variant="h6">
            Explora nuestros vinos
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Todos" {...a11yProps(0)} />
            <Tab label="Blanco" {...a11yProps(1)} />
            <Tab label="Rosado" {...a11yProps(2)} />
            <Tab label="Tinto" {...a11yProps(3)} />
            <Tab label="Naranja" {...a11yProps(4)} />
          </Tabs>
        </div>
        <article className={styles.winesSection}>
          <section className={styles.winesList}>
            <Grid container>
              <Grid size={2.5} style={{ paddingRight: "24px" }}>
                <Typography>País</Typography>
                <FormGroup>
                  {Object.entries(COUNTRIES).map(([key, label]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={checkBoxState[key]}
                          onChange={handleCheckChange}
                          name={key}
                        />
                      }
                      label={label}
                    />
                  ))}
                </FormGroup>
                <Divider />
                <Typography>Bodega</Typography>
                <FormGroup>
                  {Object.entries(WINERIES).map(([key, label]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={checkBoxState[key]}
                          onChange={handleCheckChange}
                          name={key}
                        />
                      }
                      label={label}
                    />
                  ))}
                </FormGroup>
                <Divider />
              </Grid>
              <Grid size={9.5}>
                <CustomTabPanel value={value} index={0}>
                  <Grid
                    container
                    spacing={2}
                    style={{ justifyContent: "center" }}
                  >
                    {filteredData.map((el, index) => (
                      <Grid key={index}>
                        <WineCard
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
      <footer>Contáctanos</footer>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Haz agregado un producto a tu carrito
        </Alert>
      </Snackbar>
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number,
};
