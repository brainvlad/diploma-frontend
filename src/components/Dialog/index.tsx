import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  open: boolean;
  handleClose: () => void;
  title: string;
  contentText: string;
  handleSubmit: () => void;
  children: JSX.Element;
};

export default function FormDialog({
  open,
  handleClose,
  title,
  contentText,
  handleSubmit,
  children,
}: Props) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSubmit}>Подтвердить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
