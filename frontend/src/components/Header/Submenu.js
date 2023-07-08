import { Link } from "react-router-dom";

import { Button, Typography, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindMenu,
  bindHover,
} from "material-ui-popup-state/hooks";

const Submenu = ({ page }) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: page.state,
  });

  return (
    <>
      <Button
        component={page.to && Link}
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
        {...(page.subpages && bindHover(popupState))}
      >
        {page.title}
      </Button>

      {page.subpages && (
        <HoverMenu
          {...bindMenu(popupState)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          disableScrollLock
        >
          {page.subpages.map((subpage) => (
            <MenuItem
              key={subpage.title}
              onClick={popupState.close}
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

export default Submenu;
