import {
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";

const MeditationONComp = ({ posts, cols }) => {
  let grouped = {};
  for (let i = 0; i < posts.length; i++) {
    let year = new Date(posts[i].Timestamp).getFullYear();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(posts[i]);
  }

  return Object.keys(grouped).map((year) => (
    <>
      <ImageListItem key="Subheader" cols={cols}>
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
                {"0711"}
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
