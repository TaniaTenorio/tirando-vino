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

import styles from "../page.module.css";
import CheckoutModal from "./CheckoutModal";

const CartDrawer = ({ list, closeDrawer, removeItem, updateCartList }) => {
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);

  React.useEffect(() => {
    const total = list
      .reduce((acc, item) => acc + item.productPrice * item.quantity, 0)
      .toFixed(2);

    const itemsCount = list.reduce((acc, item) => acc + item.quantity, 0);

    setTotalPrice(total);
    setTotalItems(itemsCount);
  }, [list]);

  const handlePlusQuantity = (item) => (event) => {
    event.stopPropagation();
    updateCartList(item, "plus");
  };

  const handleMinusQuantity = (item) => (event) => {
    event.stopPropagation();
    updateCartList(item, "minus");
  };

  const handleOpenCheckoutModal = (event) => {
    event.stopPropagation();
    setIsCheckoutModalOpen(true);
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  return (
    <Box
      sx={{
        width: 424,
        height: "95%",
        padding: "0px 16px",
        "@media (max-width: 600px)": {
          width: "100vw",
        },
      }}
      role="presentation"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header with close button */}
      <Container
        disableGutters
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          size="large"
          onClick={closeDrawer}
        >
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
                      onClick={removeItem(el)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <div style={{ width: 120, height: 120, textAlign: "center" }}>
                    <Image
                      src={el.productImg || "/assets/wine-clipart.png"}
                      width={el.productCategory === "wine" ? 35 : 120}
                      height={120}
                      alt="cart-item"
                    />
                  </div>
                  <ListItemText
                    style={{ marginLeft: "24px" }}
                    primary={
                      el.productCategory === "wine"
                        ? el.productName
                        : `${el.productName} - ${el.productVariety.toUpperCase()}`
                    }
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
              {`Total: $${totalPrice} MXN`}
            </Typography>
          </Container>
        </Container>

        {/* Action Buttons */}
        <Container
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Button onClick={closeDrawer} fullWidth variant="contained">
            Ver más productos
          </Button>
          <Button
            onClick={handleOpenCheckoutModal}
            fullWidth
            variant="contained"
            disabled={totalPrice <= 0}
          >
            Continuar compra
          </Button>
        </Container>
      </Container>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
        list={list}
        totalPrice={totalPrice}
      />
    </Box>
  );
};

export default CartDrawer;
