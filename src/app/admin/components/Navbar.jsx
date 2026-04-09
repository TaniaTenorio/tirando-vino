import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography } from "@mui/material";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Navbar = ({ value, handleOnChange }) => (
  <div>
    <Tabs
      value={value}
      onChange={handleOnChange}
      aria-label="admin-tabs"
      variant="scrollable"
      scrollButtons="auto"
      textColor="primary"
    >
      <Tab label="Vinos" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
      <Tab label="Merch" {...a11yProps(1)} sx={{ fontWeight: "bold" }} />
      <Tab label="Bodegas" {...a11yProps(2)} sx={{ fontWeight: "bold" }} />
      {/* <Tab label="Cupones" {...a11yProps(3)} sx={{ fontWeight: "bold" }} /> */}
    </Tabs>
  </div>
);

Navbar.propTypes = {
  value: PropTypes.number,
  handleOnChange: PropTypes.func,
};

export default Navbar;
