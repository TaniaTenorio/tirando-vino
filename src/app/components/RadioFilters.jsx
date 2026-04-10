import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Typography } from "@mui/material";

const RadioFilters = ({ wineHouse, handleOnChange, houseOptions = [] }) => (
  <FormControl>
    <FormLabel
      id="house-filters"
      style={{
        fontWeight: "bold",
        fontSize: "20px",
        color: "#000",
      }}
    >
      Bodega
    </FormLabel>
    <RadioGroup
      aria-labelledby="house-filters"
      name="house-filters"
      value={wineHouse}
      onChange={handleOnChange}
    >
      <FormControlLabel
        control={
          <Radio
            sx={{
              "@media (max-width: 600px)": {
                "& .MuiSvgIcon-root": {
                  fontSize: 16, // Even smaller icon size on very small screens
                },
              },
            }}
          />
        }
        label={<Typography variant="body2">Todos</Typography>}
        value={"TODOS"}
      />
      {houseOptions.map(({ value, label }) => (
        <FormControlLabel
          key={value}
          control={
            <Radio
              sx={{
                "@media (max-width: 600px)": {
                  "& .MuiSvgIcon-root": {
                    fontSize: 16, // Even smaller icon size on very small screens
                  },
                },
              }}
            />
          }
          label={<Typography variant="body2">{label}</Typography>}
          value={value}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

RadioFilters.propTypes = {
  wineHouse: String,
  handleOnChange: Function,
  houseOptions: Array,
};

export default RadioFilters;
