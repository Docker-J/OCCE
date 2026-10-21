import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";

import { Avatar, Box, Tooltip } from "@mui/material";
import { useConfirm } from "../common/ConfirmProvider";
import { useNotification } from "../context/NotificationContext";

const SocialIconsBar = () => {
  const confirm = useConfirm();
  const { enabled, setupPush, disablePush } = useNotification();

  const handleNotificationClick = async () => {
    const isDefault =
      !("Notification" in window) || Notification.permission === "default";

    if (isDefault) {
      setupPush();
      return;
    }

    if (enabled) {
      const ok = await confirm({
        title: "알림 수신 거부",
        message:
          "정말로 알림 수신을 거부하시겠습니까? 더 이상 새 소식 알림을 받으실 수 없습니다.",
        confirmText: "알림 끄기",
        cancelText: "취소",
        confirmColor: "warning",
      });
      if (ok) {
        disablePush();
      }
    } else {
      const ok = await confirm({
        title: "알림 수신 동의",
        message: "에드먼턴 온 교회 새 소식 알림을 받으시겠습니까?",
        confirmText: "동의",
        cancelText: "취소",
        confirmColor: "primary",
      });
      if (ok) {
        setupPush();
      }
    }
  };

  const avatarBaseSx = {
    width: 42,
    height: 42,
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
      }}
    >
      <Tooltip
        title={
          enabled
            ? "새 소식 알림 켜짐 (클릭하여 해제)"
            : "새 소식 알림 받기"
        }
        arrow
      >
        <Avatar
          onClick={handleNotificationClick}
          sx={{
            ...avatarBaseSx,
            bgcolor: enabled ? "#FF6B00" : "#475569",
            "&:hover": {
              ...avatarBaseSx["&:hover"],
              bgcolor: enabled ? "#e55f00" : "#FF6B00",
              boxShadow: "0 6px 18px rgba(255, 107, 0, 0.35)",
            },
          }}
        >
          {enabled ? (
            <NotificationsActiveIcon sx={{ fontSize: 22 }} />
          ) : (
            <NotificationsOffIcon sx={{ fontSize: 22 }} />
          )}
        </Avatar>
      </Tooltip>

      <Tooltip title="에드먼턴 온 교회 유튜브 채널" arrow>
        <Avatar
          component="a"
          href="https://www.youtube.com/@oncce"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...avatarBaseSx,
            bgcolor: "#1e293b",
            "&:hover": {
              ...avatarBaseSx["&:hover"],
              bgcolor: "#FF0000",
              boxShadow: "0 6px 18px rgba(255, 0, 0, 0.35)",
            },
          }}
        >
          <YouTubeIcon sx={{ fontSize: 24 }} />
        </Avatar>
      </Tooltip>

      <Tooltip title="교회 사무실 이메일 (office@oncce.ca)" arrow>
        <Avatar
          component="a"
          href="mailto:office@oncce.ca"
          sx={{
            ...avatarBaseSx,
            bgcolor: "#1e293b",
            "&:hover": {
              ...avatarBaseSx["&:hover"],
              bgcolor: "#FF6B00",
              boxShadow: "0 6px 18px rgba(255, 107, 0, 0.35)",
            },
          }}
        >
          <EmailIcon sx={{ fontSize: 22 }} />
        </Avatar>
      </Tooltip>
    </Box>
  );
};

export default SocialIconsBar;
