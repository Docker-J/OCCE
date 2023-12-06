import { ImageListItem } from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";

const MeditationONComp = ({ posts }) => {
  return posts.map((post) => (
    <ImageListItem key={post.ID} component={Link} to={post.ID}>
      <img
        src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${post.Cover}/thumbnail`}
        alt="thumbnail"
        loading="lazy"
      />
    </ImageListItem>
  ));
};

export const MemoizedMeditationONComp = memo(MeditationONComp);
