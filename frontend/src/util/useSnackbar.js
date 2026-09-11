import { use, useCallback, useMemo } from "react";
import { SnackBarDispatchContext } from "./SnackBarContext";

export default function useSnackbar() {
  const { open, close } = use(SnackBarDispatchContext);

  const openSnackbar = useCallback((severity, message, action) => {
    open(severity, message, action);
  }, [open]);

  const closeSnackbar = useCallback(() => {
    close();
  }, [close]);

  return useMemo(
    () => ({ openSnackbar, closeSnackbar }),
    [openSnackbar, closeSnackbar]
  );
}
