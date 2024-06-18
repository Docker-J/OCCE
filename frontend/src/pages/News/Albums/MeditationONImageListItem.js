import {
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const MeditationONComp = ({ posts, cols }) => {
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
    .map((year) => (
      <>
        <ImageListItem key={year} cols={cols}>
          <ListSubheader component="div">{year}</ListSubheader>
        </ImageListItem>
        {grouped[year].map((post) => (
          <ImageListItem
            key={post.ID}
            component={Link}
            to={post.ID}
            sx={{ textDecoration: "none" }}
          >
            <img
              src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${post.Cover}/thumbnail`}
              alt="thumbnail"
              loading="lazy"
            />
            <ImageListItemBar
              title={<Typography color="black">{post.Title}</Typography>}
              subtitle={
                <Typography fontSize="small" color="black">
                  {format(post.Timestamp, "MMdd")}
                </Typography>
              }
              position="below"
            />
          </ImageListItem>
        ))}
      </>
    ));
};

export const MemoizedMeditationONComp = memo(MeditationONComp);
