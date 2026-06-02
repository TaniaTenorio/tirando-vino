import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Modal = ({ isOpen, onClose, title, content, actions }) => {
  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      // disableEscapeKeyDown
      onClose={onClose}
      aria-labelledby="modal"
    >
      <DialogTitle id="modal-title" sx={{ textAlign: "center" }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ padding: "0px 64px 32px", textAlign: "center" }}>
        {content}
      </DialogContent>
      <DialogActions sx={{ padding: 2, justifyContent: "center" }}>
        {actions.map((action, index) => {
          if (action.render) {
            return <React.Fragment key={index}>{action.render}</React.Fragment>;
          }

          return (
            <Button
              key={index}
              color={action.color}
              variant={action.variant || "contained"}
              onClick={action.onClick}
              sx={{ margin: "0 8px", fontWeight: "bold" }}
            >
              {action.label}
            </Button>
          );
        })}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
