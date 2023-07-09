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
} from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";

const SubmenuMobile = (props) => {
  const popupState = usePopupState({
    popupId: "submenu",
    variant: "popover",
  });

  const handleClose = () => {
    props.onClose();
    popupState.close();
  };

  return (
    <>
      <MenuItem
        ref={anchorRef(popupState)}
        key={props.page.title}
        onClick={props.page.to && props.onClose}
        component={props.page.to && Link}
        to={props.page.to}
        {...bindHover(popupState)}
        {...bindFocus(popupState)}
      >
        <Typography
          textAlign="center"
          color="black"
          style={{ textDecoration: "none" }}
        >
          {props.page.title}
        </Typography>
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
              <Typography
                style={{ textDecoration: "none" }}
                color="black"
                textAlign="center"
              >
                {subpage.title}
              </Typography>
            </MenuItem>
          ))}
        </HoverMenu>
      )}
    </>
  );
};

export default SubmenuMobile;
