import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";

import { Avatar } from "@mui/material";

const SocialIconsBar = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Avatar
        component="a"
        href="https://www.youtube.com/@oncce"
        target="_blank"
        sx={{ bgcolor: "black" }}
      >
        <YouTubeIcon />
      </Avatar>

      <Avatar
        component="a"
        href="mailto:office@oncce.ca"
        target="_blank"
        sx={{ bgcolor: "black", mx: 1 }}
      >
        <EmailIcon />
      </Avatar>

      {/* <Avatar sx={{ bgcolor: "black" }}>
        <InstagramIcon />
      </Avatar> */}
    </div>
  );
};

export default SocialIconsBar;
