import { Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState, useActionState, lazy, Suspense } from "react";

const TextEditor = lazy(() => import("./TextEditor"));
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

  const [title, setTitle] = useState(origTitle);
  const [body, setBody] = useState(origBody);

  const [, formAction, isPending] = useActionState(async () => {
    try {
      await postAnnouncement(id, title, body);
      revalidator();
      openSnackbar("success", "The announcement is successfully posted!");
      handleClose();
      return { success: true };
    } catch (error) {
      console.error(error);
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator."
      );
      return { error };
    }
  }, null);

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
      {isPending ? (
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
            <Suspense fallback={<CircularProgress />}>
              <TextEditor body={body} getBody={setBody} />
            </Suspense>
          </div>

          <Button
            variant="outlined"
            disabled={isPending || title.trim() === "" || body.trim() === ""}
            onClick={formAction}
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
