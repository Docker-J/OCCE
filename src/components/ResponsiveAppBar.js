import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { color } from "@mui/system";

const pages = ["교회소개", "교회소식", "온라인", "공동체", "사진"];
const links = new Map([
  ["교회소개", "aboutus#churchname"],
  ["교회소식", "announcement"],
  ["온라인", "online"],
  ["공동체", "community"],
  ["사진", "photos"],
]);

// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

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

  console.log(useLocation());

  const currentPage = useLocation().pathname;

  return (
    <AppBar
      position={
        currentPage === "/"
          ? "absolute"
          : currentPage === "/aboutus"
          ? "absolute"
          : "static"
      }
      style={{ background: "transparent", boxShadow: "none" }}
      sx={{ color: useLocation().pathname === "/" ? "white" : "black" }}
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
                src={
                  useLocation().pathname === "/"
                    ? "img/HeaderLogoColor.png"
                    : "img/HeaderLogoBW.png"
                }
                style={{ width: "240px" }}
              />
            </Link>
          </Box>

          {/* <Typography
            component={Link}
            to="/"
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "sans-serif",
              fontWeight: 900,
              letterSpacing: ".4rem",
              color: "inherit",
            }}
          >
            에드먼턴 온 교회
          </Typography> */}

          <Box
            sx={{
              color: "inherit",
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
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
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography
                    component={Link}
                    to={`/${links.get(page)}`}
                    textAlign="center"
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1, color: "black" }}
          /> */}

          <Box
            noWrap
            sx={{
              flexGrow: 1,
              color: "inherit",
              display: { xs: "flex", md: "none" },
            }}
          >
            <Link to="/">
              <img
                src={
                  useLocation().pathname === "/"
                    ? "img/HeaderLogoColor.png"
                    : "img/HeaderLogoBW.png"
                }
                style={{ width: "200px" }}
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
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  ml: 0.8,
                  color: "inherit",
                  display: "block",
                  fontSize: "20px",
                  fontWeight: "550",
                }}
                component={Link}
                to={`/${links.get(page)}`}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* 
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
