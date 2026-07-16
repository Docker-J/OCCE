import { NavLink, useLocation } from "react-router";

import { Button, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindMenu,
  bindHover,
  bindFocus,
  anchorRef,
} from "material-ui-popup-state/hooks";

const Submenu = ({ page, scrolled }) => {
  const location = useLocation();
  const popupState = usePopupState({
    popupId: page.popupId,
    variant: "popover",
  });

  const isAnySubpageActive = page.subpages?.some(subpage => 
    location.pathname.includes(subpage.to)
  ) || (page.to && location.pathname.includes(page.to.split('#')[0]));

  return (
    <>
      <Button
        {...(!page.to && { ref: anchorRef(popupState) })}
        component={page?.to && NavLink}
        to={page?.to}
        key={page.title}
        sx={{
          my: 2,
          ml: 0.8,
          color: isAnySubpageActive ? (scrolled ? "#964B00" : "#FFE082") : "inherit",
          fontSize: "20px",
          fontWeight: "600",
          textTransform: "none",
          transition: "color 0.3s ease",
          "& .nav-button-text": {
            position: "relative",
            py: "4px",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "2px",
              bgcolor: "currentColor",
              transform: (isAnySubpageActive || popupState.isOpen) ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "bottom center",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }
          },
          "&:hover .nav-button-text::after": {
            transform: "scaleX(1)",
          },
          "& .MuiButton-endIcon": {
            transition: "transform 0.3s ease",
          },
          "&:hover .MuiButton-endIcon": {
            transform: "translateY(2px)",
          }
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
        {...(page.subpages && bindFocus(popupState))}
      >
        <span className="nav-button-text">
          {page.title}
        </span>
      </Button>

      {page.subpages && (
        <HoverMenu
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          disableScrollLock
          {...bindMenu(popupState)}
          PaperProps={{
            sx: {
              bgcolor: "rgba(252, 251, 249, 0.92)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 12px 40px rgba(150, 75, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(150, 75, 0, 0.15)",
              borderRadius: "14px",
              mt: 1.5,
              py: 0.8,
            }
          }}
        >
          {page.subpages.map((subpage) => (
            <MenuItem
              key={subpage.title}
              onClick={popupState.close}
              component={NavLink}
              to={subpage.to}
              sx={{
                fontSize: "17px",
                fontWeight: "550",
                color: "#444",
                mx: 1,
                my: 0.3,
                py: 1.2,
                px: 2,
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "rgba(150, 75, 0, 0.08)",
                  color: "#964B00",
                },
                "&.active": {
                  bgcolor: "rgba(150, 75, 0, 0.12)",
                  color: "#964B00",
                }
              }}
            >
              {subpage.title}
            </MenuItem>
          ))}
        </HoverMenu>
      )}
    </>
  );
};

export default Submenu;
