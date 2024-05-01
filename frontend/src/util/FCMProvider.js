import { useEffect } from "react";
import { messaging } from "../api/firebase";
import { getToken } from "firebase/messaging";
import { registerToken } from "../api/notification";

const FCMProvider = () => {
  const requestWebPushPermission = async () => {
    console.log("권한 요청 중...");
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BOLDzFLzljc4HkyVktgjo4-_QoXFxx__XZS6xBmGouvsisXHHe--2dSUUJtQ2cerl3v7ONBhrAPM661xRbpQcqo",
        });

        // update token
        await registerToken(token);
      }
    } catch {}
  };

  useEffect(() => {
    requestWebPushPermission();
  }, []);
};

export default FCMProvider;
