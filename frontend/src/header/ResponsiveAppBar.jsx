import { useState, useEffect } from "react";
import { Link } from "react-router";

import "./ResponsiveAppBar.css";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import PersonIcon from "@mui/icons-material/Person";
import MenuItem from "@mui/material/MenuItem";
import FullScreenLoading from "../common/FullScreenLoading";

import Submenu from "../components/Header/Submenu";
import SubmenuMobileDrawer from "../components/Header/SubmenuMobileDrawer";

import { signOut } from "../api/user.js";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_TOKEN } from "../store/Auth.js";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

import pages from "./Pages.js";
import useModals from "../util/useModal.js";
import useSnackbar from "../util/useSnackbar.js";

const ResponsiveAppBar = () => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.authToken?.authenticated);

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userPopupState = usePopupState({
    variant: "popover",
    popupId: "user",
  });

  const settings_signed = [
    {
      title: "로그아웃",
      onClick: () => {
        setIsLoggingOut(true);
        signOut(() => {
          signOutSuccess();
          setIsLoggingOut(false);
        });
      },
    },
  ];

  const settings_not_signed = [
    {
      title: "로그인",
      onClick: async () => {
        const { default: SignInModal } = await import(
          "../components/User/SignInModal"
        );
        openModal(SignInModal, {});
      },
    },
    {
      title: "회원가입",
      onClick: async () => {
        const { default: SignUpModal } = await import(
          "../components/User/SignUpModal"
        );
        openModal(SignUpModal, {});
      },
    },
  ];

  const signOutSuccess = () => {
    dispatch(DELETE_TOKEN());
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("remember");
    openSnackbar("success", "Successfully Signed Out");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: scrolled ? "rgba(252, 251, 249, 0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          boxShadow: scrolled ? "0 12px 40px rgba(255, 107, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)" : "none",
          border: scrolled ? "1px solid rgba(255, 107, 0, 0.15)" : "none",
          color: scrolled ? "#2b2b2b" : "#ffffff",
          py: scrolled ? 1.0 : 2.0,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          // Floating pill behavior when scrolled
          ...(scrolled && {
            top: "12px",
            left: { xs: "12px", md: "24px" },
            right: { xs: "12px", md: "24px" },
            width: { xs: "calc(100% - 24px)", md: "calc(100% - 48px)" },
            borderRadius: "16px",
          }),
          // Ensure transparency has correct bounds
          ...(!scrolled && {
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
          })
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ position: "relative" }}>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt="Header Logo"
                  src={scrolled ? "/img/HeaderLogoBW.png" : "/img/HeaderLogoColor.png"}
                  style={{ width: "240px", height: "48.92px", display: "block" }}
                />
              </Link>
            </Box>
  
            {/* Hamburger Menu Trigger for Mobile */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="menus"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <SubmenuMobileDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                pages={pages}
              />
            </Box>
  
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt="Header Logo"
                  className="mobileLogo"
                  src={scrolled ? "/img/HeaderLogoBW.png" : "/img/HeaderLogoColor.png"}
                  style={{ width: "180px", height: "36.69px", display: "block" }}
                />
              </Link>
            </Box>
  
            <Box
              sx={{
                ml: "auto",
                display: { xs: "none", md: "flex" },
              }}
            >
              {pages.map((page) => (
                <Submenu key={page.title} page={page} scrolled={scrolled} />
              ))}
            </Box>
  
            <Box sx={{ ml: "16px", flexGrow: 0 }}>
              <IconButton
                size="large"
                color="inherit"
                sx={{ pl: 0 }}
                {...bindTrigger(userPopupState)}
              >
                <PersonIcon fontSize="large" />
              </IconButton>
  
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                disableScrollLock
                {...bindMenu(userPopupState)}
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
                    minWidth: "160px",
                    overflow: "hidden",
                  },
                }}
              >
                {(authenticated ? settings_signed : settings_not_signed).map(
                  (setting) => (
                    <MenuItem
                      key={setting.title}
                      onClick={() => {
                        userPopupState.close();
                        if (setting.onClick) setting.onClick();
                      }}
                      sx={{
                        fontSize: "16px",
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
                      }}
                    >
                      <Typography sx={{ fontWeight: "inherit", fontSize: "inherit", color: "inherit" }}>
                        {setting.title}
                      </Typography>
                    </MenuItem>
                  ),
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {isLoggingOut && <FullScreenLoading />}
    </>
  );
};

export default ResponsiveAppBar;
