import { Box, Button, Modal, TextField } from "@mui/material";
import TextEditor from "./TextEditor";
import { useState } from "react";

import { useEffect } from "react";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "80vh",
  maxWidth: "1300px",
  bgcolor: "#ffffff",
  boxShadow: 24,
  borderRadius: "0.5em",
  p: 5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
};

const AnnouncementPostModal = ({ isOpen, onClose}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const getBody = (body) => {
    setBody(body);
  };

  const postAnnouncement = async () => {
    try {
      const result = await axios.put("/api/Announcements/postAnnouncement", {
        title: title,
        body: body,
      });

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style} bgcolor="white">
        <TextField
          id="filled-basic"
          label="Title"
          variant="outlined"
          sx={{ width: "100%" }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextEditor body={body} getBody={getBody} />

        <div>
          <Button
            variant="outlined"
            disabled={title.trim() === "" || body.trim() === ""}
            onClick={postAnnouncement}
          >
            Post
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AnnouncementPostModal;
