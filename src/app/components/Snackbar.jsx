import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

const CustomSnackbar = ({ open, handleOnClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleOnClose}
      anchorOrigin={{
        horizontal: "center",
        vertical: "top",
      }}
    >
      <Alert
        onClose={handleOnClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  handleOnClose: PropTypes.func,
  severity: PropTypes.string,
  message: PropTypes.string,
};

export default CustomSnackbar;
