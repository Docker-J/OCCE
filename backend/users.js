const express = require("express");
const router = express.Router();
const db = require("./api/firebase.js");
const {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
} = require("firebase-admin/auth");

const auth = getAuth();

router.post("/api/users/signIn", async (req, res) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      req.query.emial,
      req.query.password
    );
    const user = userCredential.user;
  } catch {}
});

router.get("/api/users/signOut", async (req, res) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      req.query.emial,
      req.query.password
    );
    const user = userCredential.user;
  } catch {}
});

module.exports = router;
