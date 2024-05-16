import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import TextEditor from "./TextEditor";
import { useEffect, useState } from "react";

import useSnackbar from "../../../util/useSnackbar";
import { postAnnouncement } from "../../../api/announcements";

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

const AnnouncementPostModal = ({
  isOpen,
  onClose,
  revalidator,
  id,
  origTitle,
  origBody,
}) => {
  const { openSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(origTitle);
  const [body, setBody] = useState(origBody);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await postAnnouncement(id, title, body);

      revalidator();
      openSnackbar("success", "The announcement is successfully posted!");
      handleClose();
    } catch (error) {
      console.log(error);
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTitle(origTitle);
    setBody(origBody);
  }, [origTitle, origBody]);

  const handleClose = () => {
    setTitle(origTitle);
    setBody(origBody);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} disableEnforceFocus={true}>
      <Box sx={style}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div style={{ height: "7%", width: "100%" }}>
              <TextField
                id="filled-basic"
                label="Title"
                variant="outlined"
                value={title}
                sx={{ width: "100%" }}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ height: "85%", width: "100%" }}>
              <TextEditor body={body} getBody={setBody} />
            </div>

            <div>
              <Button
                variant="outlined"
                disabled={title.trim() === "" || body.trim() === ""}
                onClick={onSubmit}
              >
                Post
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AnnouncementPostModal;
