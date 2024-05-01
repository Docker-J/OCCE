import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

initializeApp({
  credential: applicationDefault(),
});

export const db = getFirestore();
export const fcm = getMessaging();
