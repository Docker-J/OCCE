import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const SubmenuMobileDrawer = ({
  isOpen,
  onClose,
  pages,
}) => {
  const location = useLocation();
  const [expandedPage, setExpandedPage] = useState(null);

  const handleToggleExpand = (title) => {
    setExpandedPage(expandedPage === title ? null : title);
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "200px",
          maxWidth: "85vw",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255, 255, 255, 0.3)",
          overflowX: "hidden",
          boxSizing: "border-box",
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
                        color: isChildActive ? "#FF6B00" : "#2b2b2b",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: isChildActive ? 700 : 550,
                              color: "inherit",
                            }}
                          >
                            {page.title}
                          </Typography>
                        }
                      />
                      {isExpanded ? (
                        <ExpandLess sx={{ color: isChildActive ? "#FF6B00" : "#777" }} />
                      ) : (
                        <ExpandMore sx={{ color: isChildActive ? "#FF6B00" : "#777" }} />
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
                                bgcolor: "rgba(255, 107, 0, 0.08)",
                                color: "#FF6B00",
                                "& .MuiTypography-root": {
                                  fontWeight: "650 !important",
                                }
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    color: "inherit",
                                  }}
                                >
                                  {subpage.title}
                                </Typography>
                              }
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
                        bgcolor: "rgba(255, 107, 0, 0.08)",
                        color: "#FF6B00",
                        "& .MuiTypography-root": {
                          fontWeight: "700 !important",
                        }
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: 550,
                            color: "inherit",
                          }}
                        >
                          {page.title}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                )}
              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default SubmenuMobileDrawer;
