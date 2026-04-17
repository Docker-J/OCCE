import { memo, useEffect } from "react";
import { registerToken } from "../api/notification";
import useSnackbar from "../util/useSnackbar";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router";

import LaunchIcon from "@mui/icons-material/Launch";

const NotificationManager = memo(() => {
  const navigate = useNavigate();
  const { openSnackbar, closeSnackbar } = useSnackbar();

  const action = (action) => {
    const pathname = new URL(action).pathname;
    return (
      <IconButton
        onClick={() => {
          navigate(pathname);
          closeSnackbar();
        }}
      >
        <LaunchIcon />
      </IconButton>
    );
  };

  useEffect(() => {
    const initPushOptions = async () => {
      if (!("Notification" in window)) return;
      
      try {
        console.log("권한 요청 중...");
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const { getToken, onMessage, getMessaging } = await import("firebase/messaging");
          const { firebaseInstance } = await import("../api/firebase");
          const messaging = getMessaging(firebaseInstance);

          const token = await getToken(messaging, {
            vapidKey: "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
          });

          console.log(token);
          await registerToken(token);

          onMessage(messaging, (payload) => {
            console.log("Message Received.", payload);
            openSnackbar("info", payload.data.title, action(payload.data.click_action));
          });
        }
      } catch (e) {
        console.log(e);
      }
    };

    initPushOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
});

export default NotificationManager;
