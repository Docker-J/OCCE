import { Link } from "react-router-dom";

import { MenuItem, ListItemIcon } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import {
  usePopupState,
  bindMenu,
  bindFocus,
  bindToggle,
} from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";

const SubmenuMobile = (props) => {
  const popupState = usePopupState({
    popupId: props.page.state,
    variant: "popover",
    disableAutoFocus: true,
  });

  const handleClose = () => {
    popupState.close();
    props.menuPopupState.close();
  };

  return (
    <>
      <MenuItem
        key={props.page.title}
        onClick={props.page.to && handleClose}
        component={props.page.to && Link}
        to={props.page.to}
        {...(props.page.subpages && bindToggle(popupState))}
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
          onClose={popupState.close}
          onBlur={popupState.close}
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
