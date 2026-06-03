"use client";

import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InstagramIcon from "@mui/icons-material/Instagram";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Badge,
  Container,
  Drawer,
  IconButton,
  Toolbar,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import CartDrawer from "./CartDrawer";
import ContactUsDialog from "./ContactUs";

import { IG_PROFILE_URL } from "@/utils/constants";

const Header = ({
  cartList,
  onRemoveItem,
  onUpdateCartList,
  onCartButtonPressed,
  openCart,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const totalItems = React.useMemo(
    () => cartList.reduce((acc, item) => acc + item.quantity, 0),
    [cartList],
  );

  const handleRemoveItem = (item) => (event) => {
    event.stopPropagation();
    onRemoveItem(item);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" style={{ backgroundColor: "#c1bdbd" }}>
        <Container maxWidth="xl">
          <Toolbar variant="dense">
            <Image
              src={"/assets/tirando_vino_logo_blanco.png"}
              width={64}
              height={64}
              alt="logo"
            />
            <div style={{ flexGrow: 1, marginLeft: "32px", color: "#c69e0b" }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                size="large"
                href={IG_PROFILE_URL}
                target="_blank"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                size="large"
                onClick={handleDialogOpen}
              >
                <AlternateEmailIcon />
              </IconButton>
            </div>

            <IconButton onClick={() => onCartButtonPressed(true)}>
              <Badge badgeContent={totalItems} color="primary" showZero>
                <ShoppingCartIcon sx={{ color: "#c69e0b" }} fontSize="medium" />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        open={openCart}
        onClose={() => onCartButtonPressed(false)}
        anchor="right"
        style={{ overflow: "hidden" }}
      >
        <CartDrawer
          list={cartList}
          closeDrawer={() => onCartButtonPressed(false)}
          removeItem={handleRemoveItem}
          updateCartList={onUpdateCartList}
        />
      </Drawer>
      <ContactUsDialog open={dialogOpen} onClose={handleDialogClose} />
    </>
  );
};

export default React.memo(Header);
