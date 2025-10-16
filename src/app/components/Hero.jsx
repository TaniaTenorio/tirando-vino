import React from "react";
import styles from "../page.module.css";

const Hero = () => {
  return (
    <article className={styles.infoContent}>
      <h2 className={styles.header}>¿Quienes somos?</h2>
      <div className={styles.content}>
        <p className={styles.textContent}>
          Tirando Vino nace entre risas, copas de vino y una historia de amor.
          Para nosotros, el vino no es sólo una bebida; es un medio a través del
          cual se generan complicidades y vínculos.
        </p>
        <p className={styles.textContent}>
          No necesitamos grandes cosas para crear recuerdos inolvidables. Una
          sola copa, un brindis sincero o un día de celebración pueden quedarse
          grabados en el corazón para siempre. Sólo se necesita una cosa:
          arriesgarse a vivir intensamente.
        </p>
        <p className={styles.textContent}>
          Para algunos, los viñedos mexicanos parecen una joya oculta, pero en
          nuestro país existe una gran riqueza, donde la tradición se entrelaza
          con la innovación y la creatividad para producir grandes vinos. Por
          ello, nuestra misión es representar orgullosamente a las bodegas de
          México más destacadas.
        </p>
        <p className={styles.textContent}>
          En Tirando Vino vivimos cada día al límite, con pasión e intensidad,
          exprimiendo hasta la última gota de emoción, botella a botella.
        </p>
        <p className={styles.textContent}>
          ¡Déjanos sorprenderte con el sabor espectacular e inesperado que
          tenemos para ti!
        </p>
      </div>
    </article>
  );
};

export default Hero;
