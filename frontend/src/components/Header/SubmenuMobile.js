import { Link } from "react-router-dom";

import { MenuItem, ListItemIcon, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import {
  usePopupState,
  bindMenu,
  bindHover,
  anchorRef,
} from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";

const SubmenuMobile = (props) => {
  const popupState = usePopupState({
    popupId: props.page.state,
    variant: "popover",
  });

  const handleClose = () => {
    popupState.close();
    props.menuPopupState.close();
  };

  return (
    <>
      <MenuItem
        ref={anchorRef(popupState)}
        key={props.page.title}
        onClick={props.page.to && handleClose}
        component={props.page.to && Link}
        to={props.page.to}
        sx={{ py: 1.5 }}
        {...(props.page.subpages && bindHover(popupState))}
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

      {props.page.subpages && (
        <HoverMenu
          {...bindMenu(popupState)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          // onClose={handleClose}
          // onBlur={handleClose}
        >
          {props.page.subpages.map((subpage) => (
            <MenuItem
              key={subpage.title}
              onClick={handleClose}
              onBlur={handleClose}
              component={Link}
              to={subpage.to}
            >
              <Typography sx={{ fontSize: "13pt" }}>{subpage.title}</Typography>
            </MenuItem>
          ))}
        </HoverMenu>
      )}
    </>
  );
};

export default SubmenuMobile;
