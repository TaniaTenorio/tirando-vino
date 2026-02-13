import React from "react";
import PropTypes from "prop-types";
import styles from "../page.module.css";
import { Tabs, Tab, Typography } from "@mui/material";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Navbar = ({ value, handleOnChange }) => (
  <div className={styles.navbar}>
    <Typography align="center" color="black" variant="h6">
      Explora nuestros vinos
    </Typography>
    <Tabs
      value={value}
      onChange={handleOnChange}
      aria-label="basic tabs example"
      variant="scrollable"
      scrollButtons="auto"
      textColor="primary"
    >
      <Tab label="Todos" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
      <Tab label="Blanco" {...a11yProps(1)} sx={{ fontWeight: "bold" }} />
      <Tab label="Rosado" {...a11yProps(2)} sx={{ fontWeight: "bold" }} />
      <Tab label="Tinto" {...a11yProps(3)} sx={{ fontWeight: "bold" }} />
      <Tab label="Naranja" {...a11yProps(4)} sx={{ fontWeight: "bold" }} />
      <Tab label="Espumoso" {...a11yProps(4)} sx={{ fontWeight: "bold" }} />
    </Tabs>
  </div>
);

Navbar.propTypes = {
  value: PropTypes.number,
  handleOnChange: PropTypes.func,
};

export default Navbar;
