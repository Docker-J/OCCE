import { useState } from "react";
import { Link } from "react-router-dom";

import { Typography, MenuItem, ListItemIcon } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindMenu,
  bindHover,
} from "material-ui-popup-state/hooks";

const SubmenuMobile = (props) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: props.page.state,
  });

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <MenuItem
        key={props.page.title}
        onClick={props.page.to && props.onClose}
        component={props.page.to && Link}
        to={props.page.to}
        {...(props.page.subpages ? bindHover(popupState) : null)}
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
          {...bindMenu(popupState)}
          anchorOrigin={{ vertical: "center", horizontal: "right" }}
          transformOrigin={{ vertical: "center", horizontal: "left" }}
        >
          {props.page.subpages.map((subpage) => (
            <MenuItem
              key={subpage.title}
              onClick={() => {
                popupState.close();
                props.onClose();
              }}
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