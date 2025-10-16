"use client";

import Image from "next/image";
import styles from "./page.module.css";
import data from "./database.json";
import {
  Typography,
  Snackbar,
  Alert,
  Box,
  FormControl,
  RadioGroup,
} from "@mui/material";
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
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { COUNTRIES, WINERIES } from "@/utils/constants";

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
  const [wineHouse, setWineHouse] = React.useState("");

  const handleRadioChange = (event) => {
    console.log(event.target.value);
    setWineHouse(event.target.value);
  };

  console.log("WINE_HOUSE", wineHouse);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFilterArg(event.target.innerText);
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
    if (wineHouse !== "") {
      if (wineHouse === "TODOS") {
        setFilteredData(data);
        return;
      }
      filtered = filtered.filter((item) => item.house === wineHouse);
      setFilteredData(filtered);
    }
  }, [wineHouse]);

  console.log(filteredData);

  const onCartButtonPressed = (newItem) => {
    setCart((prevItems) => [...prevItems, newItem]);
    setOpenSnackBar(true);
    console.log(newItem);
  };
  return (
    <div className={styles.page}>
      <Header cartList={cart} />
      <Hero />
      <main className={styles.mainContent}>
        <div className={styles.navbar}>
          <Typography align="center" color="black" variant="h6">
            Explora nuestros vinos
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
          >
            <Tab label="Todos" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
            <Tab label="Blanco" {...a11yProps(1)} sx={{ fontWeight: "bold" }} />
            <Tab label="Rosado" {...a11yProps(2)} sx={{ fontWeight: "bold" }} />
            <Tab label="Tinto" {...a11yProps(3)} sx={{ fontWeight: "bold" }} />
            <Tab
              label="Naranja"
              {...a11yProps(4)}
              sx={{ fontWeight: "bold" }}
            />
          </Tabs>
        </div>
        <article className={styles.winesSection}>
          <section className={styles.winesList}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 5, sm: 3, md: 3 }} className="country-filter">
                <FormControl>
                  <FormLabel
                    id="house-filters"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#000",
                    }}
                  >
                    Bodega
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="house-filters"
                    name="house-filters"
                    value={wineHouse}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{
                            "@media (max-width: 600px)": {
                              "& .MuiSvgIcon-root": {
                                fontSize: 16, // Even smaller icon size on very small screens
                              },
                            },
                          }}
                        />
                      }
                      label={"Todos"}
                      value={"TODOS"}
                    />
                    {Object.entries(WINERIES).map(([key, label]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Radio
                            sx={{
                              "@media (max-width: 600px)": {
                                "& .MuiSvgIcon-root": {
                                  fontSize: 16, // Even smaller icon size on very small screens
                                },
                              },
                            }}
                          />
                        }
                        label={label}
                        value={key}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                <Divider />
              </Grid>
              <Grid size={{ xs: 7, sm: 9, md: 9 }}>
                <CustomTabPanel value={value} index={0}>
                  <Grid container spacing={2} className={styles.cardContainer}>
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
      <footer className={styles.footer}>
        <Box>
          <Typography variant="body2" color="textSecondary" align="center">
            {"© "}
            Tirando Vino {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </footer>
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
