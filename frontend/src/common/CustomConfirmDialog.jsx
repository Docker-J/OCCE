import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import "./CustomDialog.css";

const CustomConfirmDialog = ({ isOpen, onClose, title, body, onConfirm }) => {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: 1 }}>
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit" sx={{ px: 2 }}>취소</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary" autoFocus sx={{ px: 3 }}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomConfirmDialog;
