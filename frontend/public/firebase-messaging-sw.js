// import { initializeApp } from "firebase/app";
// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
importScripts(
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js",
);
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCipnxl2pZyIzYgXQd8a5oNfo0ZWJGfLec",
  authDomain: "church-4385c.firebaseapp.com",
  projectId: "church-4385c",
  storageBucket: "church-4385c.appspot.com",
  messagingSenderId: "581090651615",
  appId: "1:581090651615:web:692b95b77fecec4ca7286a",
  measurementId: "G-CP6DP4D6WT",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

// Force the service worker to activate immediately upon update
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log("you received a message when you haven't the app active");
  console.log(payload);

  // If the payload already contains a notification block, the browser renders it natively.
  // Do not show a duplicate notification.
  if (payload.notification) {
    console.log("Notification block present. Skipping duplicate manual notification.");
    return;
  }

  const notificationTitle = payload.data?.title || "OCCE 알림";
  const notificationOptions = {
    body: payload.data?.body || "",
    icon: "/favicons/android-icon-192x192.png",
    badge: "/favicons/favicon-32x32.png",
    data: {
      click_action: payload.data?.click_action,
    },
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data.click_action;
  event.notification.close();

  event.waitUntil(clients.openWindow(url));
});

// Manual push event handler for direct native rendering on iOS Safari
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push event received.");
  
  // Only show manual notification if running on iOS/macOS (Apple devices) to prevent duplicate notifications on Android/Windows/Linux/ChromeOS
  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  
  if (!isApple) {
    console.log("[Service Worker] Non-Apple platform detected. Leaving delivery to FCM SDK.");
    return;
  }

  if (!event.data) {
    console.log("[Service Worker] Push event has no data.");
    return;
  }

  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    console.warn("[Service Worker] Push data was not JSON. Falling back to text:", event.data.text());
    payload = { notification: { title: "OCCE 알림", body: event.data.text() } };
  }

  console.log("[Service Worker] Push payload:", payload);

  // Extract title and body from standard notification or data payload
  const notificationTitle = payload.notification?.title || payload.data?.title || "OCCE 알림";
  const notificationBody = payload.notification?.body || payload.data?.body || "새로운 소식이 있습니다.";
  const clickAction = payload.notification?.click_action || payload.data?.click_action || payload.data?.click_action || "https://oncce.ca/announcements";

  const notificationOptions = {
    body: notificationBody,
    icon: "/favicons/apple-touch-icon.png",
    badge: "/favicons/favicon-32x32.png",
    data: {
      click_action: clickAction,
    },
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

