import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  bindFocus,
  bindHover,
  bindMenu,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { createContext, useCallback, useContext, useMemo } from "react";
import { Link } from "react-router";

const CascadingContext = createContext({
  parentPopupState: null,
  rootPopupState: null,
});

export const CascadingMenu = ({ popupState, ...props }) => {
  const { rootPopupState } = useContext(CascadingContext);
  const context = useMemo(
    () => ({
      rootPopupState: rootPopupState || popupState,
      popupState: popupState,
    }),
    [rootPopupState, popupState]
  );

  return (
    <CascadingContext.Provider value={context}>
      <Menu {...props} {...bindMenu(popupState)} />
    </CascadingContext.Provider>
  );
};

export const CascadingHoverMenu = ({ popupState, ...props }) => {
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

export const CascadingMenuItem = (props) => {
  const { rootPopupState } = useContext(CascadingContext);
  if (!rootPopupState) throw new Error("must be used inside a CascadingMenu");
  const handleClick = useCallback(
    (event) => {
      rootPopupState.close(event);
    },
    [rootPopupState]
  );

  return (
    <MenuItem
      {...props}
      sx={{ py: 1.8 }}
      component={Link}
      to={props.page.to}
      // onBlur={handleClick}
      onClick={handleClick}
    />
  );
};

export const CascadingSubmenu = ({ title, popupId, ...props }) => {
  const { parentPopupState } = useContext(CascadingContext);
  const popupState = usePopupState({
    popupId: props.page.popupId,
    variant: "popover",
    parentPopupState,
  });

  return (
    <>
      <MenuItem
        sx={{ py: 1.8 }}
        {...bindHover(popupState)}
        {...bindFocus(popupState)}
      >
        <Typography sx={{ fontSize: "13pt" }}>{props.page.title}</Typography>
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
