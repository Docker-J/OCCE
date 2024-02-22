import { Link } from "react-router-dom";

import "./ResponsiveAppBar.css";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import Submenu from "../components/Header/Submenu";
import SubmenuMobile from "../components/Header/SubmenuMobile";
import { signOut } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { removeCookieToken } from "../storage/Cookie";
import { DELETE_TOKEN } from "../store/Auth";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { CascadingMenu } from "../components/Header/CascadingMenus";
// import { messaging } from "../api/firebase";
// import { getToken } from "firebase/messaging";

import pages from "./Pages.js";
import useModals from "../util/useModal.js";
import SignInModal from "./../components/User/SignInModal";
import SignUpModal from "./../components/User/SignUpModal";

const ResponsiveAppBar = () => {
  const { openModal } = useModals();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authToken);

  // const requestWebPushPermission = async () => {
  //   console.log("권한 요청 중...");
  //   try {
  //     const permission = await Notification.requestPermission();
  //     if (permission === "granted") {
  //       getToken(messaging, {
  //         vapidKey:
  //           "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
  //       }).then((token) => {
  //         console.log(token);
  //       });
  //     }
  //   } catch {}
  // };

  // useEffect(() => {
  //   requestWebPushPermission();
  // }, []);

  // console.log(token);

  const popupState = usePopupState({
    variant: "popover",
    popupId: "menuPopupState",
  });

  const userPopupState = usePopupState({
    variant: "popover",
    popupId: "user",
  });

  // const currentPage = useLocation().pathname;
  // const currnetHash = useLocation().hash;

  const settings_signed = [
    {
      title: "Sign Out",
      onClick: () => signOut(user.accessToken, signOutSuccess),
    },
  ];

  const settings_not_signed = [
    {
      title: "Sign In",
      onClick: () => openModal(SignInModal, {}),
    },
    {
      title: "Sign Up",
      onClick: () => openModal(SignUpModal, {}),
    },
  ];

  const signOutSuccess = () => {
    dispatch(DELETE_TOKEN());
    removeCookieToken();
  };

  const appBarPosition = "absolute";
  // currentPage === "/" ||
  // currentPage === "/aboutus" ||
  // currentPage.includes("/announcements") ||
  // currentPage.includes("/weeklyupdate") ||
  // currentPage.includes("/newcomers") ||
  // currentPage.includes("/nextgen/") ||
  // currentPage.includes("/community/") ||
  // currentPage.includes("/online/")
  //   ? "absolute"
  //   : "static";

  const appBarColor = "white";
  // currentPage === "/" ||
  // currentPage === "/aboutus" ||
  // currentPage.includes("/announcements") ||
  // currentPage.includes("/weeklyupdate") ||
  // currentPage.includes("/newcomers") ||
  // currentPage.includes("/nextgen/") ||
  // currentPage.includes("/community/") ||
  // currentPage.includes("/online/")
  //   ? "white"
  //   : "black";

  const logoColor = "/img/HeaderLogoColor.png";
  // currentPage === "/" ||
  // currentPage === "/aboutus" ||
  // currentPage.includes("/announcements") ||
  // currentPage.includes("/weeklyupdate") ||
  // currentPage.includes("/newcomers") ||
  // currentPage.includes("/nextgen/") ||
  // currentPage.includes("/community/") ||
  // currentPage.includes("/online/")
  // ? "/img/HeaderLogoColor.png"
  // : "/img/HeaderLogoBW.png";

  return (
    <AppBar
      position={appBarPosition}
      style={{ background: "transparent", boxShadow: "none" }}
      sx={{
        color: appBarColor,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <Link to="/">
              <img
                alt="Header Logo"
                src={logoColor}
                style={{ width: "240px" }}
              />
            </Link>
          </Box>

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
              {...bindTrigger(popupState)}
            >
              <MenuIcon />
            </IconButton>
            <CascadingMenu
              id="menu-appbar"
              popupState={popupState}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <SubmenuMobile key={page.title} page={page} />
              ))}
            </CascadingMenu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <Link to="/">
              <img
                alt="Header Logo"
                className="mobileLogo"
                src={logoColor}
                style={{ width: "180px" }}
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
              <Submenu key={page.title} page={page} />
            ))}
          </Box>

          <Box sx={{ ml: "15pt", flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                size="large"
                color="inherit"
                sx={{ pl: 0 }}
                {...bindTrigger(userPopupState)}
              >
                <PersonIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              {...bindMenu(userPopupState)}
            >
              {(user.authenticated ? settings_signed : settings_not_signed).map(
                (setting) => (
                  <MenuItem key={setting.title} onClick={userPopupState.close}>
                    <Typography
                      sx={{ color: "black" }}
                      textAlign="center"
                      onClick={setting.onClick}
                    >
                      {setting.title}
                    </Typography>
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
