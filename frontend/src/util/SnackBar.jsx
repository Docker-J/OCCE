// Modals.js
import { use } from "react";
import { Alert, Snackbar } from "@mui/material";
import {
  SnackBarDispatchContext,
  SnackBarStateContext,
} from "./SnackBarContext";

const SnackBar = () => {
  const openedSnackBar = use(SnackBarStateContext);
  const { close } = use(SnackBarDispatchContext);

  const { severity, message, action, isOpen } = openedSnackBar;

  const onClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    close();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      autoHideDuration={8000}
      onClose={onClose}
    >
      <Alert severity={severity} onClose={onClose} action={action}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
