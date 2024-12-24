import NotificationsIcon from "@mui/icons-material/Notifications";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";

import { Avatar } from "@mui/material";

const SocialIconsBar = () => {
  // TODO: Guide to Enable/Disable Notification
  // function displayNotificationGuidance() {
  //   if (navigator.userAgent.indexOf("Chrome") !== -1) {
  //     // Detect Chrome
  //     return "chrome://settings/content/notifications";
  //   } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
  //     return "about:preferences#privacy";
  //   } else if (navigator.userAgent.indexOf("Edge") !== -1) {
  //     return "edge://settings/content/notifications";
  //   }

  //   return "";
  // }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Avatar sx={{ bgcolor: "black", cursor: "pointer" }}>
        <NotificationsIcon />
      </Avatar>

      <Avatar
        component="a"
        href="https://www.youtube.com/@oncce"
        target="_blank"
        sx={{ bgcolor: "black", mx: 1 }}
      >
        <YouTubeIcon />
      </Avatar>

      <Avatar
        component="a"
        href="mailto:office@oncce.ca"
        target="_blank"
        sx={{ bgcolor: "black" }}
      >
        <EmailIcon />
      </Avatar>
    </div>
  );
};

export default SocialIconsBar;
