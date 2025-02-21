import { Box, IconButton, Modal } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "#ffffff",
  boxShadow: 24,
  borderRadius: "0.5em",
  p: 1,
  py: 5,
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
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={{ ...style, ...props }}>
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
