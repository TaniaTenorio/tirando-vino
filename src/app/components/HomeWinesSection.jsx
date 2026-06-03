import React from "react";
import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import styles from "../page.module.css";
import Navbar from "./Navbar";
import RadioFilters from "./RadioFilters";
import WineCard from "./WineCard";
import { ENV } from "@/utils/constants";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

function HomeWinesSection({
  tabValue,
  onTabChange,
  wineHouse,
  onHouseChange,
  houseOptions,
  filteredData,
  onAddToCart,
}) {
  return (
    <article className={styles.winesSection}>
      <Navbar value={tabValue} handleOnChange={onTabChange} />
      <section className={styles.winesList}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 5, sm: 3, md: 3 }} className="country-filter">
            <RadioFilters
              wineHouse={wineHouse}
              handleOnChange={onHouseChange}
              houseOptions={houseOptions}
            />
            <Divider />
          </Grid>
          <Grid size={{ xs: 7, sm: 9, md: 9 }}>
            <CustomTabPanel value={tabValue} index={0}>
              <Grid container spacing={2} className={styles.cardContainer}>
                {ENV === "development" && (
                  <Grid>
                    <WineCard
                      id={"test-item"}
                      name={"Item de Prueba"}
                      house={"Prueab"}
                      variety={"Malvar"}
                      year={null}
                      color={"Blanco"}
                      country={"Mexico"}
                      region={"Valle de Guadalupe"}
                      price={0.01}
                      imageSrc={null}
                      handleCartButton={onAddToCart}
                    />
                  </Grid>
                )}
                {filteredData.map((el) => (
                  <Grid key={el.id}>
                    <WineCard
                      id={el.id}
                      name={el.name}
                      house={el.houseName || el.house}
                      variety={el.variety}
                      year={el.year}
                      color={el.color}
                      country={el.country}
                      region={el.region}
                      price={el.price}
                      imageSrc={el.imageURL}
                      handleCartButton={onAddToCart}
                    />
                  </Grid>
                ))}
              </Grid>
            </CustomTabPanel>
          </Grid>
        </Grid>
      </section>
    </article>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number,
};

HomeWinesSection.propTypes = {
  tabValue: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  wineHouse: PropTypes.string.isRequired,
  onHouseChange: PropTypes.func.isRequired,
  houseOptions: PropTypes.array.isRequired,
  filteredData: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default React.memo(HomeWinesSection);
