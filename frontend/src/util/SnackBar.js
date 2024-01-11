// Modals.js
import { useContext } from "react";
import { Alert, Snackbar } from "@mui/material";
import {
  SnackBarDispatchContext,
  SnackBarStateContext,
} from "./SnackBarContext";

const SnackBar = () => {
  const openedSnackBar = useContext(SnackBarStateContext);
  const { close } = useContext(SnackBarDispatchContext);

  const { severity, message, isOpen } = openedSnackBar;
  // const { severity, message } = props;

  const onClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    close();
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={8000} onClose={onClose}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
