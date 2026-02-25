import React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { CheckBox } from "@mui/icons-material";

const MerchCard = ({ item, handleMerchCartButton }) => {
  const [gender, setGender] = React.useState({
    his: true,
    her: false,
  });

  const handleChange = (e) => {
    console.log("CLICK");
    setGender({
      ...gender,
      [e.target.name]: e.target.checked,
    });
  };

  const handleClick = (el) => {
    const data = {
      productId: el.id,
      productName: el.name,
      productPrice: el.price,
      productImg: el.imageURL,
      productCategory: "merch",
      productVariety: el.variety,
    };
    handleMerchCartButton(data);
  };

  return (
    <Card>
      <CardContent>
        <Image src={item.imageURL} width={300} height={300} alt="t-shirt" />
        <Typography align="center">
          {item.name} - {item.variety.toUpperCase()}
        </Typography>

        <Typography align="center">${item.price} MXN</Typography>

        <FormControlLabel
          control={
            <CheckBox checked={gender.his} name="his" onChange={handleChange} />
          }
          label="El"
        />
        <FormControlLabel
          control={
            <CheckBox checked={gender.her} name="her" onChange={handleChange} />
          }
          label="Ella"
        />

        <CardActions style={{ justifyContent: "center" }}>
          <Button
            size="small"
            onClick={() => handleClick(item)}
            variant="contained"
          >
            Agregar al carrito
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default MerchCard;
