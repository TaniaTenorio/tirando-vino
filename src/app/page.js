'use client'

import Image from "next/image";
import styles from "./page.module.css";
import data from "./database.json"
import { AppBar, Button, Toolbar, IconButton, Typography, Card, CardContent, CardActions } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { amber } from '@mui/material/colors';
import Grid from '@mui/material/Grid2';

const primary = amber[500]

const WineCard = ({ name, house, variety, year, color, country, region, price }) => {
  return (
  <Card 
  className={styles.card}
  >
    <CardContent>
      <div style={{textAlign: 'center', marginBottom: '16px'}}>
        <Image 
          src={'/assets/wine-clipart.png'}
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
      <CardActions>
        <Button size='small'>
          Agregar al carrito
        </Button>
      </CardActions>

    </CardContent>
  </Card>
  )
}

export default function Home() {
  console.log(data);
  return (
    <div className={styles.page}>
    {/* <header style={{backgroundColor: '#c69e0b', textAlign:'center', fontSize: 32}}>
      Tirando Vino
    </header> */}
    <AppBar position="static" style={{backgroundColor: '#c69e0b'}}>
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" component="div">
          Logo Tirando Vino
        </Typography>
      </Toolbar>
    </AppBar>
        <main>
        <div className={styles.navbar}>
              <p>Tintos</p>
              <p>Blancos</p>
              <p>Espumosos</p>
              <p>Rosados</p>
              <p>Por País</p>
              <p>Por Marca</p>
              <p></p>
            </div>
          <article className={styles.infoContent}>
            
              <p className={styles.content}>
                ¿Quienes somos?
              </p>
              <p className={styles.content}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>

            
          </article>
          <br />
          <article style={{padding: '0px 80px'}}>
            <section>
              <Grid container spacing={2} style={{justifyContent: 'center'}}>
                {data.map((el, index) => (
                  <Grid key={index} >
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
            </section>
          </article>
        </main>
        <footer>
          Contáctanos
        </footer>
    </div>
  );
}
