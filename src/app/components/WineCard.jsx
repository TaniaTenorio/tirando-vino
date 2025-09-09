import React from "react";

import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Modal,
  Box,
} from "@mui/material";
import styles from "../page.module.css";
import Image from "next/image";

const style = {
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "38px",
    boxShadow: 24,
    p: 5,
    textAlign: "center",
  },
  modalActions: {
    display: "flex",
    flexDirection: "column",
    marginTop: "16px",
  },
};

const WineCard = ({
  name,
  house,
  variety,
  year,
  color,
  country,
  region,
  price,
  handleCartButton,
  imageSrc,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    const dataToSend = name;
    handleCartButton(name);
  };

  return (
    <>
      <Card className={styles.card}>
        <CardContent>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Image
              src={imageSrc || "/assets/wine-clipart.png"}
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
          {/* <Typography variant="body2">{color} </Typography> */}
          <CardActions style={{ justifyContent: "center" }}>
            <Button size="small" onClick={handleOpen}>
              Vista rápida
            </Button>
          </CardActions>
          <CardActions style={{ justifyContent: "center" }}>
            <Button size="small" onClick={handleClick}>
              Agregar al carrito
            </Button>
          </CardActions>
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.modalContainer}>
          <Image
            src={"/assets/wine-clipart.png"}
            width={37}
            height={150}
            alt="wine-bottle"
          />
          <Typography>{name}</Typography>
          <Typography>{variety}</Typography>
          <Typography>{year}</Typography>
          <Typography>{color}</Typography>
          <Typography>{country}</Typography>
          <Typography>${price} MXN</Typography>
          <Box sx={style.modalActions}>
            <Button size="small" onClick={handleClick}>
              Agregar al carrito
            </Button>
            <Button size="small" onClick={handleClose}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default WineCard;
