// import { initializeApp } from "firebase/app";
// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
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

// messaging.addEventListener("notificationclick", (event) => {
//   // event.notification.close();
//   // const urlToOpen = event.data.url;
//   // // event.waitUntil(clients.openWindow(urlToOpen));
// });

messaging.onBackgroundMessage((payload) => {
  console.log("you received a message when you haven't the app active");
  console.log(payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/apple-icon.png",
    data: {
      click_action: payload.data.click_action,
    },
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data.click_action;
  event.notification.close();

  event.waitUntil(clients.openWindow(url));
});
