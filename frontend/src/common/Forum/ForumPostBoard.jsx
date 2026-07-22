import { Box, Card, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router";

import PushPinIcon from "@mui/icons-material/PushPin";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";

const ForumPostBoard = ({ announcements: posts, dateFirst }) => {
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
        maxWidth: "800px",
        padding: "0 16px",
      }}
    >
      {posts.map((post, _) => (
        <div key={post.id} style={{ width: "100%" }}>
          <Card
            component={Link}
            to={post.id}
            elevation={0}
            sx={{
              display: "flex",
              textDecoration: "none",
              bgcolor: post?.pin ? "rgba(255, 107, 0, 0.04)" : "#ffffff",
              my: 1.5,
              borderRadius: "24px",
              boxShadow: "0 4px 20px rgba(255, 107, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(255, 107, 0, 0.1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 30px rgba(255, 107, 0, 0.12)",
                borderColor: "rgba(255, 107, 0, 0.3)",
              },
            }}
          >
            {dateFirst && (
              <Stack
                direction="column"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xs: "75px", sm: "90px" },
                  px: 1,
                  py: 2.5,
                  bgcolor: "rgba(255, 107, 0, 0.06)",
                  borderRight: "1px solid rgba(255, 107, 0, 0.1)",
                  color: "#FF6B00",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 750,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: 0.5,
                  }}
                >
                  {format(new Date(post.timestamp), "MMM dd")}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "rgba(255, 107, 0, 0.7)" }}>
                  {format(new Date(post.timestamp), "yyyy")}
                </Typography>
              </Stack>
            )}

            <Box
              sx={{
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 2, sm: 2.5 },
                overflow: "hidden",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  gap: 0.8,
                  mb: 1,
                }}
              >
                {post?.pin ? (
                  <PushPinIcon sx={{ color: "#FF6B00", fontSize: 20 }} />
                ) : null}

                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "22px" },
                    fontWeight: 800,
                    color: "#2b2b2b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.title}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                sx={{
                  alignItems: "flex-end",
                  gap: 1.5,
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "#757575",
                    lineHeight: "1.5",
                    height: "42px",
                    margin: 0,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "2",
                    flex: 1,
                    wordBreak: "break-all",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {getText(post.body)}
                </p>
                {post?.images && <PhotoOutlinedIcon sx={{ color: "#b0b0b0", fontSize: 20 }} />}
                {post?.video && <MovieOutlinedIcon sx={{ color: "#b0b0b0", fontSize: 20 }} />}
              </Stack>
            </Box>

            {!dateFirst && (
              <Stack
                direction="column"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xs: "75px", sm: "90px" },
                  px: 1,
                  py: 2.5,
                  bgcolor: "rgba(255, 107, 0, 0.06)",
                  borderLeft: "1px solid rgba(255, 107, 0, 0.1)",
                  color: "#FF6B00",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 750,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: 0.5,
                  }}
                >
                  {format(new Date(post.timestamp), "MMM dd")}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "rgba(255, 107, 0, 0.7)" }}>
                  {format(new Date(post.timestamp), "yyyy")}
                </Typography>
              </Stack>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ForumPostBoard;
