import { Button } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const LeftButton = ({ fullpageApi, style }) => {
  return (
    <Button
      size="large"
      sx={{ color: "white" }}
      style={style}
      onClick={() => fullpageApi.moveSlideLeft()}
    >
      <NavigateBeforeIcon sx={{ height: "35px", width: "35px" }} />
    </Button>
  );
};

export const RightButton = ({ fullpageApi, style }) => {
  return (
    <Button
      size="large"
      sx={{ color: "white" }}
      style={style}
      onClick={() => fullpageApi.moveSlideRight()}
    >
      <NavigateNextIcon sx={{ height: "35px", width: "35px" }} />
    </Button>
  );
};
