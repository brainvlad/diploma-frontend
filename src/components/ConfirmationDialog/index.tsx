import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from '@mui/material';

type Props = {
  handleClose: () => void;
  handleAgree: () => void;
  open: boolean;
  content: string;
  title: string;
};

const ConfirmationDialog = ({
  handleClose,
  open,
  content,
  title,
  handleAgree,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Отменить
        </Button>
        <Button
          onClick={() => {
            handleAgree();
            handleClose();
          }}
          autoFocus
        >
          Да, я согласен
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
