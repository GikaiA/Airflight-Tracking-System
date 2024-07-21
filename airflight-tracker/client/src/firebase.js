// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBjTve0kV-IR6Vh_SF1odohn03Snsc-YWM",
    authDomain: "airflight-tracker-6943f.firebaseapp.com",
    projectId: "airflight-tracker-6943f",
    storageBucket: "airflight-tracker-6943f.appspot.com",
    messagingSenderId: "736113944025",
    appId: "1:736113944025:web:050858892b3d9ecc6fa5c8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
