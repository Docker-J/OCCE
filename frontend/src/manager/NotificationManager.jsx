import { memo, useEffect } from "react";
import { registerToken, unregisterToken } from "../api/notification";
import useSnackbar from "../util/useSnackbar";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router";

import LaunchIcon from "@mui/icons-material/Launch";

const NotificationManager = memo(() => {
  const navigate = useNavigate();
  const { openSnackbar, closeSnackbar } = useSnackbar();

  const action = (targetAction) => {
    return (
      <IconButton
        onClick={() => {
          closeSnackbar();
          if (targetAction && targetAction.startsWith("http") && !targetAction.includes("oncce.ca")) {
            window.open(targetAction, "_blank");
          } else {
            const pathname = targetAction.startsWith("http")
              ? new URL(targetAction).pathname
              : targetAction;
            navigate(pathname);
          }
        }}
      >
        <LaunchIcon />
      </IconButton>
    );
  };

  useEffect(() => {
    const initPushOptions = async (forcePrompt = false) => {
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        if (forcePrompt) {
          openSnackbar("error", "이 브라우저는 알림 기능을 지원하지 않습니다.");
        }
        return;
      }
      
      // If we are not forcing a prompt, check if the user explicitly opted out.
      if (!forcePrompt && localStorage.getItem("notifications_opt_out") === "true") {
        return;
      }

      const currentPermission = Notification.permission;
      
      // If we are not forcing a prompt, and the permission is default/denied, don't ask automatically (prevents iOS blocking)
      if (!forcePrompt && currentPermission !== "granted") {
        return;
      }

      if (forcePrompt && currentPermission === "denied") {
        openSnackbar(
          "warning",
          "알림 권한이 차단되어 있습니다. 브라우저 설정에서 알림 허용을 활성화해주세요."
        );
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        let permission = currentPermission;
        if (permission !== "granted") {
          console.log("권한 요청 중...");
          permission = await Notification.requestPermission();
        }

        if (permission === "granted") {
          const { getToken, onMessage, getMessaging, deleteToken } = await import("firebase/messaging");
          const { firebaseInstance } = await import("../api/firebase");
          const messaging = getMessaging(firebaseInstance);

          const lastRefresh = localStorage.getItem("last_fcm_token_refresh");
          const now = Date.now();
          // If last refresh was more than 7 days ago (604,800,000 ms), force a clean token rotation
          const shouldForceRefresh = !lastRefresh || (now - parseInt(lastRefresh, 10) > 604800000);

          if (shouldForceRefresh) {
            console.log("Forcing FCM token refresh to prevent silent expiration...");
            try {
              const cachedToken = await getToken(messaging, {
                vapidKey: "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
                serviceWorkerRegistration: registration,
              });
              if (cachedToken) {
                // Delete from our database first, then delete from Firebase cache
                await unregisterToken(cachedToken);
                await deleteToken(messaging);
              }
            } catch (err) {
              console.warn("Failed to delete old token during force refresh:", err);
            }
          }

          const token = await getToken(messaging, {
            vapidKey: "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
            serviceWorkerRegistration: registration,
          });

          console.log("FCM Token:", token);
          await registerToken(token);
          localStorage.setItem("last_fcm_token_refresh", now.toString());

          // Force dispatch state change to update icon colors
          window.dispatchEvent(new CustomEvent("notification-state-changed"));

          if (forcePrompt) {
            openSnackbar("success", "알림 설정이 완료되었습니다!");
          }

          onMessage(messaging, (payload) => {
            console.log("Message Received.", payload);
            openSnackbar("info", payload.data.title, action(payload.data.click_action));
          });
        } else if (forcePrompt) {
          openSnackbar("warning", "알림 권한이 거부되었습니다.");
        }
      } catch (e) {
        console.error(e);
        if (forcePrompt) {
          openSnackbar("error", "알림 설정 중 오류가 발생했습니다.");
        }
      }
    };

    // Auto-initialize only if already granted and not opted out
    initPushOptions(false);

    const handleSetup = async () => {
      localStorage.removeItem("notifications_opt_out");
      window.dispatchEvent(new CustomEvent("notification-state-changed"));
      await initPushOptions(true);
    };

    const handleDisable = async () => {
      try {
        const { getMessaging, deleteToken, getToken } = await import("firebase/messaging");
        const { firebaseInstance } = await import("../api/firebase");
        const messaging = getMessaging(firebaseInstance);

        // Get the active token first to delete it from DynamoDB
        try {
          const token = await getToken(messaging, {
            vapidKey: "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo"
          });
          if (token) {
            await unregisterToken(token);
            console.log("Deleted token from DynamoDB.");
          }
        } catch (e) {
          console.warn("Failed to delete token from DynamoDB:", e);
        }

        // Delete from FCM
        try {
          await deleteToken(messaging);
          console.log("Successfully deleted token from FCM.");
        } catch (e) {
          console.warn("FCM deleteToken failed:", e);
        }

        localStorage.setItem("notifications_opt_out", "true");
        window.dispatchEvent(new CustomEvent("notification-state-changed"));
        openSnackbar("success", "알림 수신이 거부되었습니다.");
      } catch (e) {
        console.error(e);
        openSnackbar("error", "설정 변경 중 오류가 발생했습니다.");
      }
    };

    window.addEventListener("trigger-notification-setup", handleSetup);
    window.addEventListener("trigger-notification-disable", handleDisable);

    return () => {
      window.removeEventListener("trigger-notification-setup", handleSetup);
      window.removeEventListener("trigger-notification-disable", handleDisable);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
});

export default NotificationManager;
