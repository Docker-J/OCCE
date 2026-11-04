import { ImageListItem } from "@mui/material";
import { Link } from "react-router";

const MeditationONComp = ({ posts }) => {
  return posts.map((post) => (
    <ImageListItem
      key={post.ID}
      component={Link}
      to={post.ID}
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <img
        src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${post.Cover}/thumbnail`}
        alt="묵상 ON 썸네일"
        loading="lazy"
        style={{
          aspectRatio: "1 / 1",
          width: "100%",
          height: "auto",
          objectFit: "cover",
          display: "block",
        }}
      />
    </ImageListItem>
  ));
};

export const MemoizedMeditationONComp = MeditationONComp;
