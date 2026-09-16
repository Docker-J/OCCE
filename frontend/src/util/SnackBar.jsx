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
      autoHideDuration={6000}
      onClose={onClose}
      sx={{
        top: { xs: "108px !important", sm: "128px !important" },
      }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        action={action}
        sx={{
          minWidth: "280px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
          backdropFilter: "blur(12px)",
          alignItems: "center",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
