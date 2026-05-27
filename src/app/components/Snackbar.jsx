import React from "react";
import { Button, Snackbar, SnackbarContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const CustomSnackbar = ({
  open,
  handleOnClose,
  severity,
  message,
  actionLabel,
  actionOnClick,
}) => {
  const action = actionLabel ? (
    <>
      <Button
        color="white"
        size="small"
        onClick={actionOnClick}
        sx={{ fontWeight: "bold" }}
      >
        {actionLabel}
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleOnClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  ) : null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleOnClose}
      anchorOrigin={{
        horizontal: "center",
        vertical: "top",
      }}
      // message={message}
      // action={action}
      // sx={{ backgroundColor: "green" }}
    >
      <SnackbarContent
        sx={{
          backgroundColor:
            severity === "success"
              ? "#4caf50"
              : severity === "error"
                ? "#f44336"
                : severity === "warning"
                  ? "#ff9800"
                  : severity === "info"
                    ? "#2196f3"
                    : "#333",
          color: "#2a532c",
          fontWeight: "regular",
        }}
        message={message}
        action={action}
      />
    </Snackbar>
  );
};

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  handleOnClose: PropTypes.func,
  severity: PropTypes.string,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  actionOnClick: PropTypes.func,
};

export default CustomSnackbar;
