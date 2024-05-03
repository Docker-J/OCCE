import { useContext } from "react";
import { SnackBarDispatchContext } from "./SnackBarContext";

export default function useSnackbar() {
  const { open, close } = useContext(SnackBarDispatchContext);

  const openSnackbar = (severity, message, action) => {
    open(severity, message, action);
  };
  const closeSnackbar = () => {
    close();
  };

  return { openSnackbar, closeSnackbar };
}
