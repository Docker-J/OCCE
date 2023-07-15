import { Link } from "react-router-dom";

import { Typography, MenuItem, ListItemIcon } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import {
  usePopupState,
  bindMenu,
  bindHover,
  bindFocus,
  anchorRef,
  bindTrigger,
} from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";

const SubmenuMobile = (props) => {
  const popupState = usePopupState({
    popupId: "submenu",
    variant: "popover",
  });

  const handleClose = () => {
    props.menuPopupState.close();
    console.log("called");
    popupState.close();
  };

  return (
    <>
      <MenuItem
        ref={anchorRef(popupState)}
        key={props.page.title}
        onClick={handleClose}
        component={props.page.to && Link}
        to={props.page.to}
        {...(props.page.subpages && bindTrigger(popupState))}
        {...(props.page.subpages && bindFocus(popupState))}
      >
        {props.page.title}
        <ListItemIcon>
          {props.page.subpages &&
            (popupState.isOpen ? (
              <ExpandLessIcon sx={{ ml: "8px" }} />
            ) : (
              <ExpandMoreIcon sx={{ ml: "8px" }} />
            ))}
        </ListItemIcon>
      </MenuItem>

      {props.page.subpages && (
        <HoverMenu
          anchorOrigin={{ vertical: "center", horizontal: "right" }}
          transformOrigin={{ vertical: "center", horizontal: "left" }}
          {...bindMenu(popupState)}
        >
          {props.page.subpages.map((subpage) => (
            <MenuItem
              key={subpage.title}
              onClick={handleClose}
              component={Link}
              to={subpage.to}
            >
              {subpage.title}
            </MenuItem>
          ))}
        </HoverMenu>
      )}
    </>
  );
};

export default SubmenuMobile;
