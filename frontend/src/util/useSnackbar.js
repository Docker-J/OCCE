import { use } from "react";
import { SnackBarDispatchContext } from "./SnackBarContext";

export default function useSnackbar() {
  const { open, close } = use(SnackBarDispatchContext);

  return {
    openSnackbar: open,
    closeSnackbar: close,
  };
}
