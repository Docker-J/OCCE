import { useContext } from "react";
import { SnackBarDispatchContext } from "./SnackBarContext";

export default function useSnackbar() {
  const { open, close } = useContext(SnackBarDispatchContext);

  const openSnackbar = (severity, message) => {
    open(severity, message);
  };
  const closeSnackbar = () => {
    close();
  };

  return { openSnackbar, closeSnackbar };
}
