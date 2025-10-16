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
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import paymentAction from "@/utils/checkout";

const CartDrawer = ({ list, closeDrawer }) => (
  <Box
    sx={{ width: 250, height: "95%", padding: "0px 16px" }}
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
        <Typography align="center">Productos en tu carrito</Typography>
        <List style={{ padding: "16px 0px" }}>
          {list.map((el) => (
            <ListItem key={el}>
              <Image
                src={"/assets/wine-clipart.png"}
                width={35}
                height={120}
                alt="wine-bottle"
              />
              <ListItemText
                style={{ marginLeft: "24px" }}
                primary={el}
                secondary="Precio del Vino"
              />
            </ListItem>
          ))}
        </List>
      </Container>
      {/* Action Buttons */}
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Button onClick={closeDrawer}>Ver mas productos</Button>
        <Button onClick={paymentAction}>Ir a Pagar</Button>
      </Container>
    </Container>
  </Box>
);

export default CartDrawer;
