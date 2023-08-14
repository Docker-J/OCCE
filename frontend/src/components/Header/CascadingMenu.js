import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  bindFocus,
  bindHover,
  bindMenu,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { createContext, useContext, useMemo } from "react";

const CascadingContext = createContext({
  parentPopupState: null,
  rootPopupState: null,
});

export const CascadingMenu = ({ popupState, ...props }) => {
  const { rootPopupState } = useContext(CascadingContext);
  const context = useMemo(
    () => ({
      rootPopupState: rootPopupState || popupState,
      parentPopupState: popupState,
    }),
    [rootPopupState, popupState]
  );

  return (
    <CascadingContext.Provider value={context}>
      <HoverMenu {...props} {...bindMenu(popupState)} />
    </CascadingContext.Provider>
  );
};

export const CascadingSubmenu = ({ title, popupId, ...props }) => {
  //   const classes = useCascadingMenuStyles()
  const { parentPopupState } = useContext(CascadingContext);
  const popupState = usePopupState({
    popupId,
    variant: "popover",
    parentPopupState,
  });
  return (
    <>
      <MenuItem {...bindHover(popupState)} {...bindFocus(popupState)}>
        <Typography sx={{ fontSize: "13pt" }}>{title}</Typography>
        <ListItemIcon>
          {props.page.subpages &&
            (popupState.isOpen ? (
              <ExpandLessIcon sx={{ ml: "8px" }} />
            ) : (
              <ExpandMoreIcon sx={{ ml: "8px" }} />
            ))}
        </ListItemIcon>
      </MenuItem>
      <CascadingMenu
        {...props}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        popupState={popupState}
      />
    </>
  );
};
