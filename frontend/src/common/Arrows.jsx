import { memo } from "react";

import { Avatar, Paper } from "@mui/material";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const PrevArrow = memo(({ onClick }) => {
  return (
    <Avatar
      component={Paper}
      elevation={5}
      sx={{
        position: "absolute",
        top: "50%",
        left: 10,
        opacity: 0.7,
        zIndex: 2,
        backgroundColor: "white",
        color: "black",
      }}
      onClick={onClick}
    >
      <NavigateBeforeIcon
        sx={{
          width: 32,
          height: 32,
        }}
      />
    </Avatar>
  );
});

export const NextArrow = memo(({ onClick }) => {
  return (
    <Avatar
      component={Paper}
      elevation={5}
      sx={{
        position: "absolute",
        top: "50%",
        right: 10,
        opacity: 0.7,
        zIndex: 2,
        backgroundColor: "white",
        color: "black",
      }}
      onClick={onClick}
    >
      <NavigateNextIcon
        sx={{
          width: 32,
          height: 32,
        }}
      />
    </Avatar>
  );
});
