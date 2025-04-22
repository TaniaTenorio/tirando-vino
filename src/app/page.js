"use client";

import Image from "next/image";
import styles from "./page.module.css";
import data from "./database.json";
import {
  AppBar,
  Button,
  Toolbar,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardActions,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { amber } from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

const primary = amber[500];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      // hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const WineCard = ({
  name,
  house,
  variety,
  year,
  color,
  country,
  region,
  price,
}) => {
  return (
    <Card className={styles.card}>
      <CardContent>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Image
            src={"/assets/wine-clipart.png"}
            width={37}
            height={150}
            alt="wine-bottle"
          />
        </div>
        <Typography>{name}</Typography>
        {/* <p>{variety}</p>
      <p>{year}</p>
      <p>{color}</p>
      <p>{country}</p>
      <p>{region}</p> */}
        <Typography>${price} MXN</Typography>
        <Typography variant="body2">{color} </Typography>
        <CardActions>
          <Button size="small">Agregar al carrito</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

const drawerWidth = 240;

export default function Home() {
  const [value, setValue] = React.useState(0);
  const [filterArg, setFilterArg] = React.useState("TODOS");
  const [filteredData, setFilteredData] = React.useState(data);

  const handleChange = (event, newValue) => {
    console.log(event.target.innerText);
    setValue(newValue);
    setFilterArg(event.target.innerText);
  };

  React.useEffect(() => {
    if (filterArg === "TODOS") {
      setFilteredData(data);
    } else if (filterArg !== "TODOS") {
      console.log("ELSE IF");
      const result = data.filter((el) => el.color.toUpperCase() === filterArg);
      setFilteredData(result);
    }
  }, [data, filterArg]);

  // console.log('ARG',filterArg);
  // console.log('DATA', filteredData);

  return (
    <div className={styles.page}>
      {/* <header style={{backgroundColor: '#c69e0b', textAlign:'center', fontSize: 32}}>
      Tirando Vino
    </header> */}
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
            <ShoppingCartIcon sx={{ color: "#c69e0b" }} fontSize="medium" />
          </Toolbar>
        </Container>
      </AppBar>

      <main>
        <article className={styles.infoContent}>
          <h2 className={styles.header}>¿Quienes somos?</h2>
          <div className={styles.content}>
            <p>
              Tirando Vino nace entre risas, copas de vino y una historia de
              amor. Para nosotros, el vino no es sólo una bebida; es un medio a
              través del cual se generan complicidades y vínculos.
            </p>
            <p>
              No necesitamos grandes cosas para crear recuerdos inolvidables.
              Una sola copa, un brindis sincero o un día de celebración pueden
              quedarse grabados en el corazón para siempre. Sólo se necesita una
              cosa: arriesgarse a vivir intensamente.
            </p>
            <p>
              Para algunos, los viñedos mexicanos parecen una joya oculta, pero
              en nuestro país existe una gran riqueza, donde la tradición se
              entrelaza con la innovación y la creatividad para producir grandes
              vinos. Por ello, nuestra misión es representar orgullosamente a
              las bodegas de México más destacadas.
            </p>
            <p>
              En Tirando Vino vivimos cada día al límite, con pasión e
              intensidad, exprimiendo hasta la última gota de emoción, botella a
              botella.
            </p>
            <p>
              ¡Déjanos sorprenderte con el sabor espectacular e inesperado que
              tenemos para ti!
            </p>
          </div>
        </article>
        <div className={styles.navbar}>
          <Typography align="center" color="black" variant="h6">
            Explora nuestros vinos
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Todos" {...a11yProps(0)} />
            <Tab label="Blanco" {...a11yProps(1)} />
            <Tab label="Rosado" {...a11yProps(2)} />
            <Tab label="Tinto" {...a11yProps(3)} />
            <Tab label="Naranja" {...a11yProps(4)} />
          </Tabs>
        </div>
        <article style={{ padding: "0px 50px" }}>
          <section className={styles.winesSection}>
            <Grid container>
              <Grid size={2.5} style={{ paddingRight: "24px" }}>
                <Typography>País</Typography>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="México" />
                  <FormControlLabel control={<Checkbox />} label="España" />
                </FormGroup>
                <Divider />
                <Typography>Bodega</Typography>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="Bruma" />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Burbujas Pop"
                  />
                  <FormControlLabel control={<Checkbox />} label="Carrodilla" />
                  <FormControlLabel control={<Checkbox />} label="Casa Anza" />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Cerca Blanca"
                  />
                  <FormControlLabel control={<Checkbox />} label="Finca Tre" />
                  <FormControlLabel control={<Checkbox />} label="Lechuza" />
                  <FormControlLabel control={<Checkbox />} label="Lomita" />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Misiones de California"
                  />
                  <FormControlLabel control={<Checkbox />} label="Vinim" />
                </FormGroup>
                <Divider />
              </Grid>
              <Grid size={9.5}>
                <CustomTabPanel value={value} index={0}>
                  <Grid container spacing={2}>
                    {filteredData.map((el, index) => (
                      <Grid key={index}>
                        <WineCard
                          name={el.name}
                          house={el.house}
                          variety={el.variety}
                          year={el.year}
                          color={el.color}
                          country={el.country}
                          region={el.region}
                          price={el.price}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CustomTabPanel>
              </Grid>
            </Grid>
          </section>
        </article>
      </main>
      <footer>Contáctanos</footer>
    </div>
  );
}
