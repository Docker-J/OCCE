import { Button, CircularProgress, TextField } from "@mui/material";
import TextEditor from "./TextEditor";
import { useEffect, useState } from "react";

import useSnackbar from "../../../util/useSnackbar";
import { postAnnouncement } from "../../../api/announcements";
import CustomModal from "../../../common/CustomModal";

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
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="1300px"
      maxHeight="90svh"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TextField
            id="filled-basic"
            label="Title"
            variant="outlined"
            value={title}
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div style={{ height: "65svh", width: "100%", marginTop: "1em" }}>
            <TextEditor body={body} getBody={setBody} />
          </div>

          <Button
            variant="outlined"
            disabled={title.trim() === "" || body.trim() === ""}
            onClick={onSubmit}
            fullWidth
            sx={{ marginTop: "1.5em" }}
          >
            Post
          </Button>
        </>
      )}
    </CustomModal>
  );
};

export default AnnouncementPostModal;
