import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const SubmenuMobileDrawer = ({
  isOpen,
  onClose,
  pages,
  authenticated,
  settings_signed,
  settings_not_signed,
}) => {
  const location = useLocation();
  const [expandedPage, setExpandedPage] = useState(null);

  const handleToggleExpand = (title) => {
    setExpandedPage(expandedPage === title ? null : title);
  };

  const handleSettingClick = (onClickAction) => {
    onClose();
    onClickAction();
  };

  const settings = authenticated ? settings_signed : settings_not_signed;

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "300px",
          maxWidth: "85vw",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255, 255, 255, 0.3)",
        },
      }}
    >
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#555",
              letterSpacing: "-0.5px",
            }}
          >
            전체메뉴
          </Typography>
          <IconButton onClick={onClose} edge="end" color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Navigation List */}
        <List sx={{ px: 1, py: 2 }}>
          {pages.map((page) => {
            const hasSubpages = page.subpages && page.subpages.length > 0;
            const isExpanded = expandedPage === page.title;
            const isChildActive = hasSubpages && page.subpages.some(subpage => 
              location.pathname.includes(subpage.to)
            );

            return (
              <Box key={page.title} sx={{ mb: 0.5 }}>
                {hasSubpages ? (
                  <>
                    <ListItemButton
                      onClick={() => handleToggleExpand(page.title)}
                      sx={{
                        borderRadius: "10px",
                        py: 1.5,
                        color: isChildActive ? "#964B00" : "#2b2b2b",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                      }}
                    >
                      <ListItemText
                        primary={page.title}
                        primaryTypographyProps={{
                          fontSize: "18px",
                          fontWeight: isChildActive ? "600" : "550",
                          color: "inherit",
                        }}
                      />
                      {isExpanded ? (
                        <ExpandLess sx={{ color: isChildActive ? "#964B00" : "#777" }} />
                      ) : (
                        <ExpandMore sx={{ color: isChildActive ? "#964B00" : "#777" }} />
                      )}
                    </ListItemButton>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 2, mt: 0.5 }}>
                        {page.subpages.map((subpage) => (
                          <ListItemButton
                            key={subpage.title}
                            component={NavLink}
                            to={subpage.to}
                            onClick={onClose}
                            sx={{
                              borderRadius: "8px",
                              py: 1.2,
                              mb: 0.2,
                              color: "#555",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.03)" },
                              "&.active": {
                                bgcolor: "rgba(150, 75, 0, 0.08)",
                                color: "#964B00",
                                "& .MuiListItemText-primary": {
                                  fontWeight: "600 !important",
                                }
                              },
                            }}
                          >
                            <ListItemText
                              primary={subpage.title}
                              primaryTypographyProps={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "inherit",
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    component={NavLink}
                    to={page.to}
                    onClick={onClose}
                    sx={{
                      borderRadius: "10px",
                      py: 1.5,
                      color: "#2b2b2b",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                      "&.active": {
                        bgcolor: "rgba(150, 75, 0, 0.08)",
                        color: "#964B00",
                        "& .MuiListItemText-primary": {
                          fontWeight: "600 !important",
                        }
                      },
                    }}
                  >
                    <ListItemText
                      primary={page.title}
                      primaryTypographyProps={{
                        fontSize: "18px",
                        fontWeight: "550",
                        color: "inherit",
                      }}
                    />
                  </ListItemButton>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Drawer Footer with User Actions */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: "rgba(0, 0, 0, 0.08)" }} />
        <Box sx={{ display: "flex", alignItems: "center", px: 1, mb: 2 }}>
          <AccountCircleIcon sx={{ color: "#aaa", mr: 1.5, fontSize: "28px" }} />
          <Typography sx={{ fontSize: "14px", fontWeight: "550", color: "#666" }}>
            {authenticated ? "온교회 교우님" : "환영합니다"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {settings.map((setting) => (
            <ListItemButton
              key={setting.title}
              onClick={() => handleSettingClick(setting.onClick)}
              sx={{
                justifyContent: "center",
                borderRadius: "10px",
                py: 1.2,
                bgcolor: setting.title === "로그인" || setting.title === "로그아웃" ? "#964B00" : "rgba(0, 0, 0, 0.05)",
                color: setting.title === "로그인" || setting.title === "로그아웃" ? "white" : "#2b2b2b",
                "&:hover": {
                  bgcolor: setting.title === "로그인" || setting.title === "로그아웃" ? "#7c3d00" : "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                {setting.title}
              </Typography>
            </ListItemButton>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default SubmenuMobileDrawer;
