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

const CustomModal = ({ isOpen, onClose, height, maxWidth, children }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style} maxWidth={maxWidth} maxHeight={height}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
