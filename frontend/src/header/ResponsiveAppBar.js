import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import Submenu from "../components/Header/Submenu";
import SubmenuMobile from "../components/Header/SubmenuMobile";
import SignInModal from "../components/User/SignInModal";
import SignUpModal from "../components/User/SignUpModal";
import { signOut } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { removeCookieToken } from "../storage/Cookie";
import { DELETE_TOKEN } from "../store/Auth";

const ResponsiveAppBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authToken);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElOnline, setAnchorElOnline] = useState(null);

  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  const onSignInModalClose = () => {
    setSignInModalOpen(false);
  };
  const onSignUpModalClose = () => {
    setSignUpModalOpen(false);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const currentPage = useLocation().pathname;
  const currnetHash = useLocation().hash;

  const pages = [
    {
      title: "교회소개",
      to: "aboutus#beginning",
    },
    {
      title: "교회소식",
      subpages: [
        {
          title: "공지사항",
          to: "announcements",
        },
        {
          title: "주보",
          to: "weeklyupdate",
        },
        {
          title: "새가족",
          to: "newcomers",
        },
        // {
        //   title: "교회사진",
        //   to: "photos",
        // },
        // {
        //   title: "교회영상",
        //   to: "videos",
        // },
      ],
      state: "newsPopupState",
    },
    {
      title: "ON-Line",
      subpages: [
        {
          title: "주일예배",
          to: "online/sundayservice",
        },
        {
          title: "말씀",
          to: "online/sermon",
        },
        {
          title: "찬양",
          to: "online/worship",
        },
        {
          title: "기도ON",
          to: "online/prayON",
        },
        {
          title: "묵상ON",
          to: "online/meditationon",
        },
      ],
      state: "onlinePopupState",
    },
    {
      title: "공동체",
      subpages: [
        {
          title: "소그룹",
          to: "community/smallgroup",
        },
        {
          title: "사역",
          to: "community/ministry",
        },
      ],
      state: "communityPopupState",
    },
    {
      title: "다음세대",
      subpages: [
        {
          title: "유아유치부",
          to: "nextgen/preschool",
        },
        {
          title: "유초등부",
          to: "nextgen/elementary",
        },
        {
          title: "중고등부",
          to: "nextgen/youth",
        },
        {
          title: "청년부",
          to: "nextgen/youngadult",
        },
      ],
      state: "nextGenPopupState",
    },
  ];

  const settings_signed = [
    {
      title: "Sign Out",
      onClick: () => signOut(user.accessToken, signOutSuccess),
    },
  ];

  const settings_not_signed = [
    { title: "Sign In", onClick: () => setSignInModalOpen(true) },
    { title: "Sign Up", onClick: () => setSignUpModalOpen(true) },
  ];

  const signOutSuccess = () => {
    dispatch(DELETE_TOKEN());
    removeCookieToken();
  };

  return (
    <>
      <AppBar
        position={
          currentPage === "/"
            ? "absolute"
            : currentPage === "/aboutus"
            ? "absolute"
            : "static"
        }
        style={{ background: "transparent", boxShadow: "none" }}
        sx={{
          color:
            currentPage === "/" || currentPage === "/aboutus"
              ? "white"
              : "black",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                color: "inherit",
                display: { xs: "none", md: "flex" },
              }}
            >
              <Link to="/">
                <img
                  alt="Header Logo"
                  src={
                    currentPage === "/" || currentPage === "/aboutus"
                      ? "/img/HeaderLogoColor.png"
                      : "/img/HeaderLogoBW.png"
                  }
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
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <SubmenuMobile
                    key={page.title}
                    page={page}
                    onClose={handleCloseNavMenu}
                  />
                ))}
              </Menu>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                color: "inherit",
                display: { xs: "flex", md: "none" },
              }}
            >
              <Link to="/">
                <img
                  alt="Header Logo"
                  className="mobileLogo"
                  src={
                    currentPage === "/" || currentPage === "/aboutus"
                      ? "/img/HeaderLogoColor.png"
                      : "/img/HeaderLogoBW.png"
                  }
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
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {(user.authenticated
                  ? settings_signed
                  : settings_not_signed
                ).map((setting) => (
                  <MenuItem key={setting.title} onClick={handleCloseUserMenu}>
                    <Typography
                      sx={{ color: "black" }}
                      textAlign="center"
                      onClick={setting.onClick}
                    >
                      {setting.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <SignInModal open={signInModalOpen} onClose={onSignInModalClose} />
      <SignUpModal open={signUpModalOpen} onClose={onSignUpModalClose} />
    </>
  );
};

export default ResponsiveAppBar;
