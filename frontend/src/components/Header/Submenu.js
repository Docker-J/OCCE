import { NavLink } from "react-router-dom";

import { Button, Typography, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindMenu,
  bindHover,
  bindFocus,
} from "material-ui-popup-state/hooks";

const Submenu = ({ page }) => {
  const popupState = usePopupState({
    popupId: page.state,
    variant: "popover",
  });

  return (
    <>
      <Button
        component={page.to && NavLink}
        to={page.to}
        key={page.title}
        sx={{
          my: 2,
          ml: 0.8,
          color: "inherit",
          fontSize: "20px",
          fontWeight: "550",
        }}
        endIcon={
          page.subpages &&
          (popupState.isOpen ? (
            <ExpandLessIcon sx={{ ml: "-8px" }} />
          ) : (
            <ExpandMoreIcon sx={{ ml: "-8px" }} />
          ))
        }
        {...bindHover(popupState)}
        {...bindFocus(popupState)}
      >
        {page.title}
      </Button>

      {page.subpages && (
        <HoverMenu
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          disableScrollLock
          {...bindMenu(popupState)}
        >
          {page.subpages.map((subpage) => (
            <MenuItem
              key={subpage.title}
              onClick={popupState.close}
              component={NavLink}
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

export default Submenu;
