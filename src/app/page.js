import Image from "next/image";
import styles from "./page.module.css";
import data from "./database.json"

const WineCard = ({ name, house, variety, year, color, country, region, price }) => {
  return (
  <div className={styles.card}>
    <div style={{textAlign: 'center', marginBottom: '16px'}}>
      <Image 
        src={'/assets/wine-clipart.png'}
        width={37}
        height={150}
        alt="wine-bottle"
      />
    </div>
    <p>{name}</p>
    {/* <p>{variety}</p>
    <p>{year}</p>
    <p>{color}</p>
    <p>{country}</p>
    <p>{region}</p> */}
    <p>${price} MXN</p>
  </div>
  )
}

export default function Home() {
  console.log(data);
  return (
    <div className={styles.page}>
    <header style={{backgroundColor: '#c69e0b', textAlign:'center', fontSize: 32}}>
      Tirando Vino
    </header>
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
          <article style={{padding: '0 px 80px'}}>
            <p>
              ¿Quienes somos?
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
          </article>
          <br />
          <article style={{padding: '0px 80px'}}>
            <section>
              <div className={styles.list}>
                {data.map((el, index) => (
                  <WineCard
                    key={index} 
                    name={el.name}
                    house={el.house}
                    variety={el.variety}
                    year={el.year}
                    color={el.color}
                    country={el.country}
                    region={el.region}
                    price={el.price}
                  />
                ))}
              </div>
            </section>
          </article>
        </main>
        <footer>
          Contáctanos
        </footer>
    </div>
  );
}
