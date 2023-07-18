const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { messaging } = require("firebase-admin");

initializeApp({
  credential: applicationDefault(),
});
const db = getFirestore();
const fcm = messaging();

// Initialize Firebase
module.exports = { db, fcm };
