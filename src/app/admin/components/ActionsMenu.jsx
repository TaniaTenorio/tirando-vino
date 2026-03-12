"use client";

import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useRouter } from "next/navigation";

const ITEM_HEIGHT = 48;

const ActionsMenu = ({ row, type }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const isInactive = row?.state === "inactive";
  const statusOptionLabel = isInactive ? "Reactivar" : "Eliminar";
  const options = ["Editar", statusOptionLabel];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    if (option === "Editar") {
      handleEdit();
    } else if (option === statusOptionLabel) {
      setOpenConfirm(true);
    }
    handleClose();
  };

  const handleEdit = () => {
    router.push(`/admin/edit/${type}/${row.id}`);
  };

  const handleStatusConfirm = async () => {
    const nextState = isInactive ? "active" : "inactive";

    try {
      const response = await fetch(`/api/admin/${type}/${row.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: nextState }),
      });

      if (response.ok) {
        setOpenConfirm(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
          list: {
            "aria-labelledby": "long-button",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isInactive ? "Confirmar reactivación" : "Confirmar eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que deseas {isInactive ? "reactivar" : "eliminar"}{" "}
            {row?.name}? Esta acción no puede deshacerse.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button
            onClick={handleStatusConfirm}
            color={isInactive ? "success" : "error"}
            autoFocus
          >
            {statusOptionLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActionsMenu;
