import { ImageList, ImageListItem } from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";

const MeditationONComp = ({ posts }) => {
  return posts.map((post) => (
    <ImageListItem key={post.id} component={Link} to={post.id}>
      <img
        // src={`${
        //   item.data().images[0]
        // }?w=164&h=164&fit=crop&auto=format`}
        src={post["0"]}
        // onClick={}
        // srcSet={`${
        //   item.data().images[0]
        // }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
        alt="test"
        loading="lazy"
      />
    </ImageListItem>
  ));
};

export const MemoizedMeditationONComp = memo(MeditationONComp);
