import { useMemo, useState } from "react";
import {
  SnackBarDispatchContext,
  SnackBarStateContext,
} from "./SnackBarContext";

const SnackbarProvider = ({ children }) => {
  const [openedSnackBar, setOpenedSnackBar] = useState({});
  const open = (severity, message) => {
    setOpenedSnackBar({ severity, message, isOpen: true });
  };

  const close = () => {
    setOpenedSnackBar({ isOpen: false });
  };

  console.log(openedSnackBar);

  const dispatch = useMemo(() => ({ open, close }), []);

  return (
    <SnackBarDispatchContext.Provider value={dispatch}>
      <SnackBarStateContext.Provider value={openedSnackBar}>
        {children}
      </SnackBarStateContext.Provider>
    </SnackBarDispatchContext.Provider>
  );
};

export default SnackbarProvider;
