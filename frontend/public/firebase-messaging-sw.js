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
  console.log("[Service Worker] Received background message via FCM:", payload);
});

self.addEventListener("notificationclick", (event) => {
  // If this notification was NOT manually shown by us (doesn't have event.notification.data.click_action),
  // do not handle it here. Let the Firebase SDK's built-in handler deal with the click action natively.
  const hasCustomClickAction = event.notification.data && event.notification.data.click_action;
  if (!hasCustomClickAction) {
    console.log("[Service Worker] Non-custom notification click detected. Leaving handling to FCM SDK.");
    return;
  }

  // Otherwise, handle manual/custom notifications (e.g., iOS Safari or manual foreground snackbar clicks)
  event.notification.close();

  let url = event.notification.data.click_action;

  // Resolve relative paths to absolute same-origin URLs
  if (url && !url.includes("://")) {
    url = `https://oncce.ca${url.startsWith("/") ? "" : "/"}${url}`;
  }

  const isCrossOrigin = url && url.startsWith("http") && !url.includes("oncce.ca");

  if (isCrossOrigin) {
    // For cross-origin URLs (e.g. YouTube), always open a new window directly
    event.waitUntil(
      clients.openWindow(url)
    );
  } else {
    // For same-origin URLs, try to focus and navigate an existing PWA client
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("oncce.ca") && "focus" in client) {
            if ("navigate" in client) {
              client.navigate(url);
            }
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Manual push event handler for direct native rendering on all platforms (iOS, Android, etc.)
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push event received.");
  
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

  // If the payload already contains a standard 'notification' block,
  // the browser/FCM SDK will handle showing it automatically.
  // We only show it manually if there is no 'notification' block (i.e. data-only message).
  if (payload.notification) {
    console.log("[Service Worker] Notification payload present. Let browser/FCM SDK handle display.");
    return;
  }

  // Extract title and body from standard notification or data payload
  const notificationTitle = payload.notification?.title || payload.data?.title || "OCCE 알림";
  const notificationBody = payload.notification?.body || payload.data?.body || "새로운 소식이 있습니다.";
  const clickAction = payload.notification?.click_action || payload.data?.click_action || "https://oncce.ca/announcements";

  const notificationOptions = {
    body: notificationBody,
    icon: "/favicons/android-icon-192x192.png",
    badge: "/favicons/favicon-32x32.png",
    data: {
      click_action: clickAction,
    },
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

