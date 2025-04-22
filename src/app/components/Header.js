import { AppBar, Container, Toolbar, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <AppBar position="static" style={{ backgroundColor: "#c1bdbd" }}>
      <Container maxwidth="xl">
        <Toolbar variant="dense">
          <Image src={"/assets/logo.png"} width={64} height={64} alt="logo" />
          <div style={{ flexGrow: 1, marginLeft: "32px", color: "#c69e0b" }}>
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
          <IconButton onClick={() => router.push("/checkout")}>
            <ShoppingCartIcon sx={{ color: "#c69e0b" }} fontSize="medium" />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
