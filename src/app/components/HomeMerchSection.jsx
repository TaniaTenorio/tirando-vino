import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import styles from "../page.module.css";
import MerchCard from "./MerchCard";

function HomeMerchSection({ merchData, onAddToCart }) {
  return (
    <article>
      <section>
        <div className={styles.sectionHeader}>
          <Typography align="center" color="black" variant="h6">
            {" "}
            Llévate una playerita
          </Typography>
        </div>
        <div className={styles.merchContainer}>
          <Grid container spacing={2}>
            {merchData.map((el) => (
              <Grid key={el.id}>
                <MerchCard item={el} handleCartButton={onAddToCart} />
              </Grid>
            ))}
          </Grid>
        </div>
      </section>
    </article>
  );
}

HomeMerchSection.propTypes = {
  merchData: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default React.memo(HomeMerchSection);
