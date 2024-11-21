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
import PersonIcon from "@mui/icons-material/Person";
import MenuItem from "@mui/material/MenuItem";

import Submenu from "../components/Header/Submenu";
import SubmenuMobile from "../components/Header/SubmenuMobile";
import { signOut } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_TOKEN } from "../store/Auth";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { CascadingMenu } from "../components/Header/CascadingMenus";

import pages from "./Pages.js";
import useModals from "../util/useModal.js";
import SignInModal from "./../components/User/SignInModal";
import SignUpModal from "./../components/User/SignUpModal";
import useSnackbar from "../util/useSnackbar.js";

const ResponsiveAppBar = () => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.authToken?.authenticated);

  const popupState = usePopupState({
    variant: "popover",
    popupId: "menuPopupState",
  });

  const userPopupState = usePopupState({
    variant: "popover",
    popupId: "user",
  });

  const settings_signed = [
    {
      title: "로그아웃",
      onClick: () => signOut(signOutSuccess),
    },
  ];

  const settings_not_signed = [
    {
      title: "로그인",
      onClick: () => openModal(SignInModal, {}),
    },
    ...(process.env.NODE_ENV === "development"
      ? [
          {
            title: "회원가입",
            onClick: () => openModal(SignUpModal, {}),
          },
        ]
      : []),
  ];

  const signOutSuccess = () => {
    dispatch(DELETE_TOKEN());
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("remember");
    openSnackbar("success", "Successfully Signed Out");
  };

  const appBarPosition = "absolute";
  const appBarColor = "white";
  const logoColor = "/img/HeaderLogoColor.png";

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
            <IconButton
              size="large"
              color="inherit"
              sx={{ pl: 0 }}
              {...bindTrigger(userPopupState)}
            >
              <PersonIcon fontSize="large" />
            </IconButton>

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
              {(authenticated ? settings_signed : settings_not_signed).map(
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
