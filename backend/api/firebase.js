import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import messaging from "firebase-admin";

initializeApp({
  credential: applicationDefault(),
});
export const db = getFirestore();
export const fcm = messaging;

// Initialize Firebase
// module.exports = { db, fcm };
