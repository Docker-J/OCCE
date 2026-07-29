import { Box, Card, Stack, Typography, Chip } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router";

import PushPinIcon from "@mui/icons-material/PushPin";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const ForumPostBoard = ({ 
  announcements: posts, 
  themeColor = "#FF6B00",
  themeBg = "rgba(255, 107, 0, 0.08)",
  themeHover = "rgba(255, 107, 0, 0.15)",
  dateFirst // kept for prop compatibility but unused in new design
}) => {
  function getText(html) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    let allTextNodes = Array.from(doc.body.childNodes).filter(
      (node) =>
        node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE,
    );
    return allTextNodes.map((node) => node.textContent.trim()).join(" ");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "850px",
      }}
    >
      {posts.map((post) => (
        <div key={post.id} style={{ width: "100%" }}>
          <Card
            component={Link}
            to={post.id}
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              bgcolor: post?.pin ? themeBg : "#ffffff",
              mb: 3,
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: "24px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              "&:hover": {
                transform: "translateY(-4px) scale(1.01)",
                boxShadow: `0 16px 40px ${themeBg}, 0 4px 12px rgba(0,0,0,0.05)`,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                borderColor: themeColor,
                "& .post-title": {
                  color: themeColor,
                },
                "& .hover-bar": {
                  width: "100%",
                }
              },
            }}
          >
            {/* Top Row: Badge & Icons */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {!!post?.pin && (
                  <Chip 
                    icon={<PushPinIcon sx={{ fontSize: "16px !important", color: "white !important" }} />}
                    label="중요"
                    size="small"
                    sx={{ 
                      bgcolor: themeColor, 
                      color: "white", 
                      fontWeight: 800,
                      borderRadius: "10px",
                    }} 
                  />
                )}
                <Chip
                  icon={<CalendarTodayIcon sx={{ fontSize: "14px !important", color: `${themeColor} !important` }} />}
                  label={format(new Date(post.timestamp), "yyyy. MM. dd")}
                  size="small"
                  sx={{
                    bgcolor: themeBg,
                    color: themeColor,
                    fontWeight: 700,
                    borderRadius: "10px",
                    border: `1px solid ${themeHover}`
                  }}
                />
              </Stack>
              
              <Stack direction="row" spacing={1}>
                {post?.images && (
                  <Box sx={{ p: 0.8, borderRadius: "50%", bgcolor: "#f5f5f5", display: "flex", alignItems: "center" }}>
                    <PhotoOutlinedIcon sx={{ color: "#777", fontSize: 18 }} />
                  </Box>
                )}
                {post?.video && (
                  <Box sx={{ p: 0.8, borderRadius: "50%", bgcolor: "#f5f5f5", display: "flex", alignItems: "center" }}>
                    <MovieOutlinedIcon sx={{ color: "#777", fontSize: 18 }} />
                  </Box>
                )}
              </Stack>
            </Stack>

            {/* Title */}
            <Typography
              className="post-title"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                fontWeight: 800,
                color: "#2b2b2b",
                mb: 1.5,
                lineHeight: 1.3,
                wordBreak: "keep-all",
                transition: "color 0.3s ease",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "2",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {post.title}
            </Typography>

            {/* Preview Text */}
            <Typography
              sx={{
                fontSize: "15px",
                color: "#666666",
                lineHeight: "1.6",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-all",
              }}
            >
              {getText(post.body)}
            </Typography>
            
            {/* Hover Indicator Effect */}
            <Box 
              className="hover-bar"
              sx={{
                position: "absolute",
                left: 0,
                bottom: 0,
                height: "4px",
                width: "0%",
                bgcolor: themeColor,
                transition: "width 0.4s ease",
              }}
            />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ForumPostBoard;
