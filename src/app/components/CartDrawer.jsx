import React from "react";
import {
  Container,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import paymentAction from "@/utils/checkout";

import styles from "../page.module.css";
import { CURRENCY } from "@/utils/constants";

const CartDrawer = ({ list, closeDrawer, removeItem, updateCartList }) => {
  const [totalAmount, setTotalAmount] = React.useState(0);

  React.useEffect(() => {
    const total = list
      .reduce((acc, item) => acc + item.productPrice * item.quantity, 0)
      .toFixed(2);

    setTotalAmount(total);
  }, [list]);

  const handlePlusQuantity = (item) => (event) => {
    event.stopPropagation();
    updateCartList(item, "plus");
  };

  const handleMinusQuantity = (item) => (event) => {
    event.stopPropagation();
    updateCartList(item, "minus");
  };

  const handleOnClick = (event) => {
    event.stopPropagation();
    const paymentData = {
      amount: totalAmount,
      currency: CURRENCY,
      purchase_description: "Compra en Tirando Vino",
    };
    paymentAction(paymentData);
  };

  return (
    <Box
      sx={{
        width: 350,
        height: "95%",
        padding: "0px 16px",
        "@media (max-width: 600px)": {
          width: "100vw",
        },
      }}
      role="presentation"
      onClick={closeDrawer}
    >
      {/* Header with close button */}
      <Container
        disableGutters
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <IconButton edge="start" color="inherit" aria-label="menu" size="large">
          <CloseIcon />
        </IconButton>
      </Container>
      <Container
        disableGutters
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "inherit",
        }}
      >
        {/* List items */}
        <Container
          disableGutters
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            align="center"
            variant="h5"
            style={{ paddingBottom: "16px" }}
          >
            Tu carrito
          </Typography>
          <Divider />
          {list.length === 0 ? (
            <div className={styles.emptyMessage}>
              <Typography>
                Aún no haz agregado productos a tu carrito
              </Typography>
            </div>
          ) : (
            <List style={{ padding: "16px 0px" }}>
              {list.map((el) => (
                <ListItem
                  key={el.productId}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={removeItem(el.productId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Image
                    src={el.productImg}
                    width={35}
                    height={120}
                    alt="wine-bottle"
                  />
                  <ListItemText
                    style={{ marginLeft: "24px" }}
                    primary={el.productName}
                    secondary={`$${el.productPrice} MXN`}
                  />
                  <div>
                    <div className={styles.quantityInput}>
                      <button onClick={handleMinusQuantity(el.productId)}>
                        -
                      </button>
                      <p>{el.quantity}</p>
                      <button onClick={handlePlusQuantity(el.productId)}>
                        +
                      </button>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          )}
          <Divider />
          <Container
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              align="center"
              variant="h6"
              style={{ padding: "16px 0px", fontWeight: "bold" }}
            >
              {`Total: $${totalAmount} MXN`}
            </Typography>
          </Container>
        </Container>
        {/* Action Buttons */}
        <Container
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Button onClick={closeDrawer} fullWidth variant="contained">
            Ver mas productos
          </Button>
          <Button
            onClick={handleOnClick}
            // disabled={list.length === 0}
            // Update this once the payment gateway is functional
            // disabled={false}
            disabled
            fullWidth
            variant="contained"
          >
            Ir a Pagar
          </Button>
        </Container>
      </Container>
    </Box>
  );
};

export default CartDrawer;
