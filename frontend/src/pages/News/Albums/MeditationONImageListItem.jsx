import { ViewTransition } from "react";
import {
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import { format } from "date-fns";

export const MeditationONComp = ({ posts, cols }) => {
  const grouped = {};
  let currentYear = null;
  for (let post of posts) {
    const year = new Date(post.Timestamp).getFullYear();

    if (year !== currentYear) {
      currentYear = year;
      grouped[year] = []; // Create a new array for the new year
    }

    grouped[year].push(post);
  }

  return Object.keys(grouped)
    .reverse()
    .flatMap((year) => [
      <ImageListItem key={`header-${year}`} cols={cols}>
        <ListSubheader component="div">{year}</ListSubheader>
      </ImageListItem>,
      ...grouped[year].map((post) => (
        <ImageListItem
          key={post.ID}
          component={Link}
          to={post.ID}
          viewTransition
          sx={{
            contentVisibility: "auto",
            containIntrinsicSize: "0 280px",
            textDecoration: "none",
            borderRadius: "8px",
            overflow: "hidden",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <ViewTransition
            name={`album-cover-${post.ID}`}
            share="morph"
            default="none"
          >
            <img
              src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${post.Cover}/thumbnail`}
              alt={post.Title || "thumbnail"}
              loading="lazy"
              style={{
                aspectRatio: "1 / 1",
                width: "100%",
                height: "auto",
                objectFit: "cover",
                display: "block",
              }}
            />
          </ViewTransition>
          <ImageListItemBar
            title={
              <ViewTransition
                name={`album-title-${post.ID}`}
                share="text-morph"
                default="none"
              >
                <Typography
                  color="black"
                  sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                >
                  {post.Title}
                </Typography>
              </ViewTransition>
            }
            subtitle={
              <Typography
                color="black"
                sx={{
                  fontSize: "small",
                }}
              >
                {format(post.Timestamp, "MMdd")}
              </Typography>
            }
            position="below"
          />
        </ImageListItem>
      )),
    ]);
};

export const MemoizedMeditationONComp = MeditationONComp;
