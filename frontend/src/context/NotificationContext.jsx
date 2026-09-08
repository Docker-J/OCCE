import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { registerToken, unregisterToken, unlinkTokenRole } from "../api/notification";
import useAuthStore from "../store/useAuthStore";
import useSnackbar from "../util/useSnackbar";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import FullScreenLoading from "../common/FullScreenLoading";

import LaunchIcon from "@mui/icons-material/Launch";

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const navigate = useNavigate();
  const { openSnackbar, closeSnackbar } = useSnackbar();

  const [enabled, setEnabled] = useState(
    () =>
      "Notification" in window &&
      Notification.permission === "granted" &&
      localStorage.getItem("notifications_opt_out") !== "true"
  );
  
  const [isLoading, setIsLoading] = useState(false);

  const action = useCallback(
    (targetAction) => {
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
    },
    [closeSnackbar, navigate]
  );

  const initPushOptions = useCallback(
    async (forcePrompt = false) => {
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        if (forcePrompt) {
          openSnackbar("error", "이 브라우저는 알림 기능을 지원하지 않습니다.");
        }
        return;
      }

      if (!forcePrompt && localStorage.getItem("notifications_opt_out") === "true") {
        setEnabled(false);
        return;
      }

      const currentPermission = Notification.permission;

      if (!forcePrompt && currentPermission !== "granted") {
        setEnabled(false);
        return;
      }

      if (forcePrompt && currentPermission === "denied") {
        openSnackbar(
          "warning",
          "알림 권한이 차단되어 있습니다. 브라우저 설정에서 알림 허용을 활성화해주세요."
        );
        setEnabled(false);
        return;
      }

      try {
        if (forcePrompt) setIsLoading(true);
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        let permission = currentPermission;
        if (permission !== "granted") {
          console.log("권한 요청 중...");
          permission = await Notification.requestPermission();
        }

        if (permission === "granted") {
          const { getToken, onMessage, getMessaging } = await import("firebase/messaging");
          const { firebaseInstance } = await import("../api/firebase");
          const messaging = getMessaging(firebaseInstance);

          const token = await getToken(messaging, {
            vapidKey: "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
            serviceWorkerRegistration: registration,
          });

          console.log("FCM Token:", token);

          const lastRefresh = localStorage.getItem("last_fcm_token_refresh");
          const now = Date.now();
          const shouldRefreshTTL = !lastRefresh || (now - parseInt(lastRefresh, 10) > 259200000);

          if (shouldRefreshTTL) {
            console.log("Refreshing FCM token TTL in database...");
            const isRemembered =
              document.cookie.includes("remember=true") ||
              localStorage.getItem("remember") === "true";
            await registerToken(token, isRemembered);
            localStorage.setItem("last_fcm_token_refresh", now.toString());
          }

          setEnabled(true);

          if (forcePrompt) {
            openSnackbar("success", "알림 설정이 완료되었습니다!");
          }

          onMessage(messaging, (payload) => {
            console.log("Message Received.", payload);
            const title = payload.data?.title || payload.notification?.title || "OCCE 알림";
            const body = payload.data?.body || payload.notification?.body || "";
            const displayMessage = body ? `${title} | ${body}` : title;
            const clickAction = payload.data?.click_action || payload.notification?.click_action;
            openSnackbar("info", displayMessage, action(clickAction));
          });
        } else if (forcePrompt) {
          openSnackbar("warning", "알림 권한이 거부되었습니다.");
          setEnabled(false);
        }
      } catch (e) {
        console.error(e);
        if (forcePrompt) {
          openSnackbar("error", "알림 설정 중 오류가 발생했습니다.");
        }
        setEnabled(false);
      } finally {
        if (forcePrompt) setIsLoading(false);
      }
    },
    [action, openSnackbar]
  );

  const authenticated = useAuthStore((state) => state.authenticated);
  const isLeader = useAuthStore((state) => state.isLeader);
  const admin = useAuthStore((state) => state.admin);
  const isRememberedStore = useAuthStore((state) => state.isRemembered);
  const prevAuthRef = useRef(authenticated);

  useEffect(() => {
    initPushOptions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Automatically sync roles or unlink upon login/logout state changes
    const syncRole = async () => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      if (localStorage.getItem("notifications_opt_out") === "true") return;

      try {
        const { getMessaging, getToken } = await import("firebase/messaging");
        const { firebaseInstance } = await import("../api/firebase");
        const messaging = getMessaging(firebaseInstance);
        const registration = await navigator.serviceWorker.ready;
        const token = await getToken(messaging, {
          vapidKey: "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
          serviceWorkerRegistration: registration,
        });

        if (!token) return;

        if (authenticated) {
          const isRemembered =
            isRememberedStore ||
            document.cookie.includes("remember=true") ||
            localStorage.getItem("remember") === "true";

          if (isRemembered && (isLeader || admin)) {
            console.log("Syncing role to FCM token for trusted personal device...");
            await registerToken(token, true);
          } else {
            // Demoted from leader/admin, or logged in without Remember Me
            console.log("Unlinking roles from FCM token (not leader/admin or not remembered)...");
            await unlinkTokenRole(token);
          }
        } else if (prevAuthRef.current === true) {
          // Explicitly logged out from an authenticated session
          console.log("Unlinking roles from FCM token on logout...");
          await unlinkTokenRole(token);
        }
      } catch (err) {
        console.warn("FCM token role sync warning:", err);
      } finally {
        prevAuthRef.current = authenticated;
      }
    };

    syncRole();
  }, [authenticated, isLeader, admin, isRememberedStore]);

  const setupPush = async () => {
    localStorage.removeItem("notifications_opt_out");
    setEnabled(true);
    await initPushOptions(true);
  };

  const disablePush = async () => {
    setIsLoading(true);
    try {
      const { getMessaging, deleteToken, getToken } = await import("firebase/messaging");
      const { firebaseInstance } = await import("../api/firebase");
      const messaging = getMessaging(firebaseInstance);

      try {
        const token = await getToken(messaging, {
          vapidKey: "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
        });
        if (token) {
          await unregisterToken(token);
          console.log("Deleted token from DynamoDB.");
        }
      } catch (e) {
        console.warn("Failed to delete token from DynamoDB:", e);
      }

      try {
        await deleteToken(messaging);
        console.log("Successfully deleted token from FCM.");
      } catch (e) {
        console.warn("FCM deleteToken failed:", e);
      }

      localStorage.removeItem("last_fcm_token_refresh");
      localStorage.setItem("notifications_opt_out", "true");
      setEnabled(false);
      openSnackbar("success", "알림 수신이 거부되었습니다.");
    } catch (e) {
      console.error(e);
      openSnackbar("error", "설정 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NotificationContext.Provider value={{ enabled, setupPush, disablePush }}>
      {children}
      {isLoading && <FullScreenLoading />}
    </NotificationContext.Provider>
  );
};
