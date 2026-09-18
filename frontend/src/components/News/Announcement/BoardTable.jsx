import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router";

import PushPinIcon from "@mui/icons-material/PushPin";
import MovieIcon from "@mui/icons-material/Movie";
import PhotoIcon from "@mui/icons-material/Photo";

import { extractPlainText } from "../../../util/textUtils";

const BoardTable = ({ announcements }) => {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {announcements.map((announcement, index) => (
        <div key={announcement.id}>
          <Card
            component={Link}
            to={announcement.id}
            color="black"
            sx={{
              display: "flex",
              textDecoration: "none",
              backgroundColor: announcement.pin ? "lightgrey" : null,
              px: 2,
              py: 0,
              my: 1.8,
            }}
          >
            <Stack
              direction="column"
              sx={{
                justifyContent: "center",
                width: "40px",
                minWidth: "40px",
              }}
            >
              <Typography variant="body2" sx={{
                whiteSpace: "nowrap"
              }}>
                {format(new Date(announcement.timestamp), "MMM dd")}
              </Typography>
              <Typography variant="body2">
                {format(new Date(announcement.timestamp), "yyyy")}
              </Typography>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

            <Box
              sx={{
                py: 1.5,
                flexGrow: 1,
                overflow: "hidden",
              }}
            >
              <Stack direction="row" sx={{
                alignItems: "center"
              }}>
                {announcement.pin ? (
                  <PushPinIcon fontSize="small" sx={{ m: 0 }} />
                ) : null}
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {announcement.title}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{
                alignItems: "center"
              }}>
                <p
                  style={{
                    fontSize: "0.9em",
                    lineHeight: "1.2em",
                    height: "2.4em",
                    margin: 0,
                    marginTop: 12,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "2",
                    width: "100%",
                    wordBreak: "break-all",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {extractPlainText(announcement.body)}
                </p>
                {announcement.images !== null ? <PhotoIcon /> : null}
                {announcement.video ? <MovieIcon /> : null}
              </Stack>
            </Box>
          </Card>
          {index !== announcements.length - 1 && <Divider variant="middle" />}
        </div>
      ))}
    </div>
  );
};

export default BoardTable;
