import { useState } from "react";
import {
  SnackBarDispatchContext,
  SnackBarStateContext,
} from "./SnackBarContext";

const SnackbarProvider = ({ children }) => {
  const [openedSnackBar, setOpenedSnackBar] = useState({});
  const open = (severity, message, action) => {
    setOpenedSnackBar({ severity, message, action, isOpen: true });
  };

  const close = () => {
    setOpenedSnackBar({ isOpen: false });
  };

  const dispatch = { open, close };

  return (
    <SnackBarDispatchContext value={dispatch}>
      <SnackBarStateContext value={openedSnackBar}>
        {children}
      </SnackBarStateContext>
    </SnackBarDispatchContext>
  );
};

export default SnackbarProvider;
