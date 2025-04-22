import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import styles from "../page.module.css";
import Image from "next/image";

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

export default WineCard;
