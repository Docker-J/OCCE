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
          my: 1.75,
          ml: 0.8,
          color: isAnySubpageActive ? (scrolled ? "#FF6B00" : "#FFE082") : "inherit",
          fontSize: "20.5px",
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
            elevation: 0,
            sx: {
              bgcolor: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(24px)",
              color: "#2b2b2b",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(255, 107, 0, 0.08)",
              border: "1px solid rgba(255, 107, 0, 0.18)",
              borderRadius: "16px",
              mt: 0.8,
              py: 1,
              minWidth: "180px",
              overflow: "hidden",
            },
          }}
        >
          {page.subpages.map((subpage) => (
            <MenuItem
              key={subpage.title}
              onClick={popupState.close}
              component={NavLink}
              to={subpage.to}
              sx={{
                fontSize: "16.5px",
                fontWeight: "600",
                color: "#2b2b2b",
                mx: 1,
                my: 0.3,
                py: 1.2,
                px: 2,
                borderRadius: "10px",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "rgba(255, 107, 0, 0.08)",
                  color: "#FF6B00",
                  transform: "translateX(4px)",
                },
                "&.active": {
                  bgcolor: "rgba(255, 107, 0, 0.12)",
                  color: "#FF6B00",
                  fontWeight: "700",
                },
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
