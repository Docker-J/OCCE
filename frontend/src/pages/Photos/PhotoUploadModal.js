import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

const MeditationONModal = ({ openModal, setOpenModal }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    height: "800px",
    bgcolor: "#ffffff",
    border: "0.1px solid #f57c00",
    boxShadow: 24,
    p: 2,
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const [albumURL, setAlbumURL] = useState("");

  async function post() {
    await axios.post("/api/photos/uploadAlbum", {
      url: albumURL,
    });
  }

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={style} bgcolor="white">
        <TextField
          type="url"
          helperText="Enter the album URL"
          onChange={(event) => setAlbumURL(event.currentTarget.value)}
        />

        <Button onClick={post} variant="contained" component="label">
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default MeditationONModal;
