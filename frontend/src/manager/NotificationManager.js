import { useEffect } from "react";
import { messaging } from "../api/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { registerToken } from "../api/notification";
import useSnackbar from "../util/useSnackbar";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

import LaunchIcon from "@mui/icons-material/Launch";

const NotificationManager = () => {
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

  const requestWebPushPermission = async () => {
    console.log("권한 요청 중...");
    if (!("Notification" in window)) {
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
        });

        console.log(token);

        // register/update token
        await registerToken(token);
      }
    } catch {}
  };

  onMessage(messaging, (payload) => {
    console.log("Message Received.", payload);

    openSnackbar("info", payload.data.title, action(payload.data.click_action));
  });

  useEffect(() => {
    requestWebPushPermission();
  }, []);
};

export default NotificationManager;
