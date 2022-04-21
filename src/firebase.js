import * as firebase from 'firebase/app';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCipnxl2pZyIzYgXQd8a5oNfo0ZWJGfLec",
  authDomain: "church-4385c.firebaseapp.com",
  projectId: "church-4385c",
  storageBucket: "church-4385c.appspot.com",
  messagingSenderId: "581090651615",
  appId: "1:581090651615:web:692b95b77fecec4ca7286a",
  measurementId: "G-CP6DP4D6WT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;