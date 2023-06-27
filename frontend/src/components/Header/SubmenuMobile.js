import { Link } from "react-router-dom";

import { Typography, MenuItem, ListItemIcon, Menu } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindMenu,
  bindHover,
  bindTrigger,
} from "material-ui-popup-state/hooks";

const SubmenuMobile = (props) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: props.page.state,
  });

  const handleClose = () => {
    popupState.close();
    props.onClose();
  };

  return (
    <>
      <MenuItem
        key={props.page.title}
        onClick={props.page.to && props.onClose}
        component={props.page.to && Link}
        to={props.page.to}
        {...(props.page.subpages ? bindTrigger(popupState) : null)}
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
        <Menu
          {...bindMenu(popupState)}
          anchorOrigin={{ vertical: "center", horizontal: "right" }}
          transformOrigin={{ vertical: "center", horizontal: "left" }}
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
        </Menu>
      )}
    </>
  );
};

export default SubmenuMobile;
