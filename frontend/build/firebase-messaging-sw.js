import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCipnxl2pZyIzYgXQd8a5oNfo0ZWJGfLec",
  authDomain: "church-4385c.firebaseapp.com",
  projectId: "church-4385c",
  storageBucket: "church-4385c.appspot.com",
  messagingSenderId: "581090651615",
  appId: "1:581090651615:web:692b95b77fecec4ca7286a",
  measurementId: "G-CP6DP4D6WT",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/apple-icon.png",
  };

  this.registration.showNotification(notificationTitle, notificationOptions);
});
