import { Button, CircularProgress, TextField } from "@mui/material";
import TextEditor from "../Announcement/TextEditor";
import { useEffect, useState } from "react";

import { postColumn } from "../../../api/columns";
import useSnackbar from "../../../util/useSnackbar";
import CustomModal from "../../../common/CustomModal";
import ButtonDatePicker from "../../../common/ButtonDatePicker";

const ColumnPostModal = ({
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [body, setBody] = useState(origBody);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await postColumn(id, title, body, selectedDate);

      revalidator();
      openSnackbar("success", "The column is successfully posted!");
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
          <div style={{ width: "100%" }}>
            <TextField
              id="filled-basic"
              label="Title"
              variant="outlined"
              value={title}
              sx={{ width: "85%" }}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <ButtonDatePicker
              sx={{ width: "10%" }}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>

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

export default ColumnPostModal;
