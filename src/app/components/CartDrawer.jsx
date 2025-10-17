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

const CartDrawer = ({ list, closeDrawer, removeItem }) => (
  <Box
    sx={{ width: 350, height: "95%", padding: "0px 16px" }}
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
            <Typography>Aún no has agregado productos a tu carrito</Typography>
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
              </ListItem>
            ))}
          </List>
        )}
      </Container>
      {/* Action Buttons */}
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Button onClick={closeDrawer}>Ver mas productos</Button>
        <Button onClick={paymentAction} disabled={list.length === 0}>
          Ir a Pagar
        </Button>
      </Container>
    </Container>
  </Box>
);

export default CartDrawer;
