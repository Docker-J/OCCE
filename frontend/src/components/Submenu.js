import { Link } from "react-router-dom";

import { Box, Button, Typography, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindMenu,
  bindHover,
} from "material-ui-popup-state/hooks";

const Submenu = (props) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: props.page.state,
  });

  return (
    <Box>
      <Button
        component={props.page.to && Link}
        to={props.page.to}
        key={props.page.title}
        sx={{
          my: 2,
          ml: 0.8,
          color: "inherit",
          display: "flex",
          fontSize: "20px",
          fontWeight: "550",
        }}
        endIcon={
          props.page.subpages &&
          (popupState.isOpen ? (
            <ExpandLessIcon sx={{ ml: "-8px" }} />
          ) : (
            <ExpandMoreIcon sx={{ ml: "-8px" }} />
          ))
        }
        {...(props.page.subpages ? bindHover(popupState) : null)}
      >
        {props.page.title}
      </Button>
      {props.page.subpages && (
        <HoverMenu
          {...bindMenu(popupState)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {props.page.subpages.map((subpage) => (
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
    </Box>
  );
};

export default Submenu;
