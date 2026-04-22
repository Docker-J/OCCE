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
        maxWidth: "800px",
      }}
    >
      {posts.map((post, _) => (
        <div key={post.id}>
          <Card
            component={Link}
            to={post.id}
            sx={{
              display: "flex",
              textDecoration: "none",
              bgcolor: post?.pin ? "lightgrey" : null,
              my: 1.8,
              borderRadius: 4,
            }}
            elevation={3}
          >
            {dateFirst && (
              <Stack
                direction="column"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80px",
                  p: 2.8,
                  bgcolor: "#7b8e7e",
                  borderRadius: "16px 0 0 16px",
                  borderBottom: `8px solid #5d6c5f`,
                  color: "white",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                  }}
                >
                  {format(new Date(post.timestamp), "MMM dd")}
                </Typography>
                <Typography variant="body2">
                  {format(new Date(post.timestamp), "yyyy")}
                </Typography>
              </Stack>
            )}

            <Box
              sx={{
                px: 2.2,
                py: 1.8,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                }}
              >
                {post?.pin ? (
                  <PushPinIcon fontSize="small" sx={{ m: 0 }} />
                ) : null}
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: 770,
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
                  marginTop: "8px",
                  alignItems: "end",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9em",
                    lineHeight: "1.2",
                    height: "2.4em",
                    margin: 0,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "2",
                    width: "100%",
                    wordBreak: "break-all",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {getText(post.body)}
                </p>
                {post?.images && <PhotoOutlinedIcon sx={{ color: "gray" }} />}
                {post?.video && <MovieOutlinedIcon sx={{ color: "gray" }} />}
              </Stack>
            </Box>

            {!dateFirst && (
              <Stack
                direction="column"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80px",
                  p: 2.8,
                  bgcolor: "#7b8e7e",
                  borderRadius: "0 16px 16px 0",
                  borderBottom: `8px solid #5d6c5f`,
                  color: "white",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                  }}
                >
                  {format(new Date(post.timestamp), "MMM dd")}
                </Typography>
                <Typography variant="body2">
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
