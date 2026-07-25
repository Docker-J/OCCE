import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";

import { Avatar } from "@mui/material";
import useModals from "../util/useModal";
import CustomConfirmDialog from "../common/CustomConfirmDialog";
import { useNotification } from "../context/NotificationContext";

const SocialIconsBar = () => {
  const { openModal } = useModals();
  const { enabled, setupPush, disablePush } = useNotification();

  const handleNotificationClick = () => {
    const isDefault = !("Notification" in window) || Notification.permission === "default";

    if (isDefault) {
      setupPush();
      return;
    }

    if (enabled) {
      openModal(CustomConfirmDialog, {
        title: "알림 수신 거부",
        body: "정말로 알림 수신을 거부하시겠습니까? 더 이상 새 소식 알림을 받으실 수 없습니다.",
        onConfirm: () => {
          disablePush();
        },
      });
    } else {
      openModal(CustomConfirmDialog, {
        title: "알림 수신 동의",
        body: "OCCE 새 소식 알림을 받으시겠습니까?",
        onConfirm: () => {
          setupPush();
        },
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Avatar
        onClick={handleNotificationClick}
        sx={{ bgcolor: "black", cursor: "pointer" }}
      >
        {enabled ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
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
