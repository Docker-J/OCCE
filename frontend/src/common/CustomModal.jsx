import { Box, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./CustomDialog.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxWidth: "500px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const CustomModal = ({ isOpen, onClose, children, ...props }) => {
  const handleClose = (_, reason) => {
    if (reason == "backdropClick") return;
    onClose();
  };
  return (
    <Modal 
      open={isOpen} 
      onClose={handleClose}
      slotProps={{
        backdrop: { className: 'custom-dialog-backdrop' }
      }}
    >
      <Box className="custom-modal-box" sx={{ ...style, ...props }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
