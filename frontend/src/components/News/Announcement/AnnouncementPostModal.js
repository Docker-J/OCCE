import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import TextEditor from "./TextEditor";
import { useState } from "react";

import axios from "axios";
import useSnackbar from "../../../util/useSnackbar";

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

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const uploadImage = async (file) => {
    var blob = dataURLtoBlob(file);
    const form = new FormData();
    form.append("image", blob, "image.jpg");

    const result = await axios.post("/api/Announcements/uploadImage", form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });

    return result.data;
  };

  const postAnnouncement = async () => {
    setLoading(true);
    try {
      let modifiedBody = body;
      const regex = /(<img[^>]+src=")([^">]+)"/g;

      let match;
      const images = [];
      while ((match = regex.exec(body)) !== null) {
        const imageID = await uploadImage(match[2]);
        images.push(imageID);

        modifiedBody = modifiedBody.replace(
          match[0],
          `${match[1]}https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${imageID}/Announcements"`
        );
      }

      await axios.put(
        id
          ? "/api/Announcements/editAnnouncement"
          : "/api/Announcements/postAnnouncement",
        {
          id: id ? id : null,
          title: title,
          body: modifiedBody,
          images: images,
        }
      );

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

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} disableEnforceFocus={true}>
      <Box sx={style} bgcolor="white">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div style={{ height: "7%", width: "100%" }}>
              <TextField
                id="filled-basic"
                label="Title"
                variant="outlined"
                defaultValue={origTitle}
                sx={{ width: "100%" }}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ height: "85%", width: "100%" }}>
              <TextEditor body={origBody} getBody={setBody} />
            </div>

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
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AnnouncementPostModal;
