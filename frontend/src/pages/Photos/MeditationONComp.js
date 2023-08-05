import { ImageListItem, ImageListItemBar } from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";

const MeditationONComp = ({ photos }) => {
  return photos.map((post) => (
    <ImageListItem key={post.id} component={Link} to={post.id}>
      <img
        // src={`${
        //   item.data().images[0]
        // }?w=164&h=164&fit=crop&auto=format`}
        src={post.cover}
        // onClick={}
        // srcSet={`${
        //   item.data().images[0]
        // }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
        alt="test"
        loading="lazy"
      />
      <ImageListItemBar title={post.title} />
    </ImageListItem>
  ));
};

export const MemoizedMeditationONComp = memo(MeditationONComp);
