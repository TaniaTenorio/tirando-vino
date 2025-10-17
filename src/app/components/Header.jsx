import React from "react";
import {
  AppBar,
  Container,
  Toolbar,
  IconButton,
  Drawer,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import CartDrawer from "./CartDrawer";
import { styled } from "@mui/material/styles";

import Image from "next/image";
import { useRouter } from "next/navigation";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `1px solid black`,
    padding: "0 2px",
  },
}));

const Header = ({ cartList, onRemoveItem, onUpdateCartList }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [totalItems, setTotalItems] = React.useState(0);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleRemoveItem = (item) => (event) => {
    event.stopPropagation();
    onRemoveItem(item);
  };

  React.useEffect(() => {
    const total = cartList.reduce((acc, item) => acc + item.quantity, 0);
    setTotalItems(total);
  }, [cartList]);

  return (
    <>
      <AppBar position="fixed" style={{ backgroundColor: "#c1bdbd" }}>
        <Container maxwidth="xl">
          <Toolbar variant="dense">
            <Image src={"/assets/logo.png"} width={64} height={64} alt="logo" />
            <div style={{ flexGrow: 1, marginLeft: "32px", color: "#c69e0b" }}>
              {/* <Image
                src={"/assets/logo.png"}
                width={64}
                height={64}
                alt="logo"
              /> */}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                size="large"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                size="large"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                size="large"
              >
                <AlternateEmailIcon />
              </IconButton>
            </div>

            <IconButton onClick={toggleDrawer(true)}>
              <Badge badgeContent={totalItems} color="primary" showZero>
                <ShoppingCartIcon sx={{ color: "#c69e0b" }} fontSize="medium" />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        style={{ overflow: "hidden" }}
      >
        <CartDrawer
          list={cartList}
          closeDrawer={toggleDrawer(false)}
          removeItem={handleRemoveItem}
          updateCartList={onUpdateCartList}
        />
      </Drawer>
    </>
  );
};

export default Header;
