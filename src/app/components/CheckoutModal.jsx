import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import ClientContactForm from "./ClientContactForm";
import Modal from "./Modal";
import PayButton from "./PayButton";

const ZIP_REGEX = /^(?!00)\d{5}$/;

const INITIAL_CONTACT_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  stateCode: "",
  stateName: "",
  city: "",
  zip: "",
};

const CheckoutModal = ({ isOpen, onClose, list, totalPrice }) => {
  const [step, setStep] = React.useState("contact");
  const [contactForm, setContactForm] = React.useState(INITIAL_CONTACT_FORM);
  const [validationTriggered, setValidationTriggered] = React.useState(false);

  const isContactFormComplete = React.useMemo(() => {
    return (
      contactForm.name.trim() !== "" &&
      contactForm.email.trim() !== "" &&
      contactForm.phone.trim() !== "" &&
      contactForm.address.trim() !== "" &&
      contactForm.stateCode.trim() !== "" &&
      contactForm.city.trim() !== "" &&
      ZIP_REGEX.test(contactForm.zip)
    );
  }, [contactForm]);

  process.env.NODE_ENV === "development" &&
    console.log("contactForm:", contactForm);

  const handleFormChange = React.useCallback((updates) => {
    setContactForm((prevForm) => ({ ...prevForm, ...updates }));
  }, []);

  const handleProceedToSummary = React.useCallback(() => {
    setValidationTriggered(true);

    if (!isContactFormComplete) {
      return;
    }

    setStep("summary");
  }, [isContactFormComplete]);

  const handleBackToForm = React.useCallback(() => {
    setStep("contact");
  }, []);

  const handleClose = React.useCallback(() => {
    setStep("contact");
    setValidationTriggered(false);
    onClose();
  }, [onClose]);

  const cartSubtotal = React.useMemo(
    () =>
      list.reduce((acc, item) => acc + item.productPrice * item.quantity, 0),
    [list],
  );

  const totalItems = React.useMemo(
    () => list.reduce((acc, item) => acc + item.quantity, 0),
    [list],
  );

  const totalAmount = Number(totalPrice) || cartSubtotal;

  const hasFreeShipping = React.useMemo(() => {
    const stateCode = contactForm.stateCode.trim().toUpperCase();
    const qualifiesByAmountOrItems = totalAmount >= 4000 || totalItems >= 6;

    return stateCode === "CMX" && qualifiesByAmountOrItems;
  }, [contactForm.stateCode, totalAmount, totalItems]);

  const deliveryFee = React.useMemo(() => {
    if (hasFreeShipping) {
      return 0;
    }

    const stateCode = contactForm.stateCode.trim().toUpperCase();

    if (stateCode === "CMX") {
      return 250;
    }

    if (stateCode === "MEX") {
      return 450;
    }

    return 600;
  }, [contactForm.stateCode, hasFreeShipping]);

  const totalPriceWithDelivery = React.useMemo(
    () => (cartSubtotal + deliveryFee).toFixed(2),
    [cartSubtotal, deliveryFee],
  );

  const summaryContent = (
    <Stack spacing={2} sx={{ mt: 2, textAlign: "left" }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Resumen de compra
      </Typography>
      <List
        sx={{
          p: 0,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {list.map((item) => {
          const lineSubtotal = (item.productPrice * item.quantity).toFixed(2);

          return (
            <ListItem
              key={item.productId}
              sx={{
                px: 1.5,
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <ListItemText
                primary={`${item.productName}`}
                secondary={`$${lineSubtotal} MXN`}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: { xs: "0.88rem", sm: "0.95rem" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: { xs: "180px", sm: "260px" },
                    },
                  },
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                x{item.quantity}
              </Typography>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: 1.5,
          backgroundColor: "rgba(0,0,0,0.02)",
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}
        >
          <Typography variant="body2">Envío</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ${deliveryFee.toFixed(2)} MXN
          </Typography>
        </Box>
        <Divider sx={{ my: 0.75 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 700 }}>Total</Typography>
          <Typography sx={{ fontWeight: 700 }}>
            ${totalPriceWithDelivery} MXN
          </Typography>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Datos de envío
      </Typography>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: 1.5,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">Nombre: {contactForm.name}</Typography>
            <Typography variant="body2">Correo: {contactForm.email}</Typography>
            <Typography variant="body2">
              Teléfono: {contactForm.phone}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              Dirección: {contactForm.address}, {contactForm.city},{" "}
              {contactForm.zip}, {contactForm.stateName}
            </Typography>
          </Grid>
        </Grid>
        <Button
          color="primary"
          variant="text"
          onClick={handleBackToForm}
          sx={{ margin: "0", fontWeight: "bold", gridColumn: "1 / -1" }}
        >
          Editar datos
        </Button>
      </Box>
    </Stack>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === "contact" ? "Datos de envío" : "Confirma tu compra"}
      content={
        step === "contact" ? (
          <>
            <Typography align="center">
              Antes de terminar, compártenos tu datos para poder enviarte tus
              productos.
            </Typography>
            <ClientContactForm
              formData={contactForm}
              onFormChange={handleFormChange}
              validationTriggered={validationTriggered}
            />
          </>
        ) : (
          summaryContent
        )
      }
      actions={
        step === "contact"
          ? [
              {
                label: "Cancelar",
                color: "secondary",
                onClick: handleClose,
              },
              {
                label: "Listo",
                color: "primary",
                onClick: handleProceedToSummary,
              },
            ]
          : [
              {
                render: (
                  <PayButton
                    totalPrice={totalPriceWithDelivery}
                    contactForm={contactForm}
                  />
                ),
              },
              {
                label: "Cancelar",
                color: "secondary",
                onClick: handleClose,
              },
            ]
      }
    />
  );
};

export default CheckoutModal;
