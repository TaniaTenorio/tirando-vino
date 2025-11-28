import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import emailjs from "@emailjs/browser";
import CustomSnackbar from "./Snackbar";
import {
  EMAIL_JS_ADMIN,
  EMAIL_JS_SERVICE_ID,
  EMAIL_JS_TEMPLATE_ID,
} from "@/utils/constants";

const ContactUsDialog = ({ onClose, open }) => {
  const form = React.useRef();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarState, setSnackBarState] = React.useState(null);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");

  console.log("emailJS", process.env.EMAIL_JS_PUBLIC_KEY);

  const sendEmail = (e, templateParams) => {
    e.preventDefault();

    emailjs
      .send(EMAIL_JS_SERVICE_ID, EMAIL_JS_TEMPLATE_ID, templateParams, {
        publicKey: process.env.EMAIL_JS_PUBLIC_KEY,
      })
      .then(
        (response) => {
          setOpenSnackBar(true);
          setSnackBarState("success");
          setSnackBarMessage("Tu mensaje ha sido enviado correctamente");
          onClose();
        },
        (error) => {
          setOpenSnackBar(true);
          setSnackBarState("error");
          setSnackBarMessage(
            'Ha habido un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde."',
          );
        },
      );
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOnClick = (e) => {
    const data = {
      name,
      email,
      message,
      to_name: EMAIL_JS_ADMIN,
    };
    sendEmail(e, data);
  };

  const handleSnackbarClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            margin: "auto",
          }}
        >
          ¿Cómo podemos ayudarte?
        </DialogTitle>
        <DialogContent
          style={{
            margin: "20px 20px 0px 20px",
          }}
        >
          <DialogContentText>
            Cuéntanos tus dudas o comentarios y nos pondremos en contacto
            contigo lo antes posible.
          </DialogContentText>
          <FormControl
            fullWidth
            sx={{ mb: 2, marginTop: "16px" }}
            variant="outlined"
            ref={form}
          >
            <label htmlFor="user-name">Nombre</label>
            <TextField
              id="user-name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <label htmlFor="user-name">Correo</label>
            <TextField
              id="user-email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label htmlFor="user-name">Detalles</label>
            <TextField
              id="message"
              multiline
              rows={8}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            margin: "0px 40px 16px 40px",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => handleOnClick(e)}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={openSnackBar}
        handleOnClose={handleSnackbarClose}
        severity={snackBarState}
        message={snackBarMessage}
      />
    </>
  );
};

export default ContactUsDialog;
