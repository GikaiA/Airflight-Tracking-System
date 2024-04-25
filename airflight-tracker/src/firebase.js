// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyOSXrp00knRDZdd796qosdul2D-WJ64U",
  authDomain: "airflight-tracker-9dc79.firebaseapp.com",
  databaseURL: "https://airflight-tracker-9dc79-default-rtdb.firebaseio.com",
  projectId: "airflight-tracker-9dc79",
  storageBucket: "airflight-tracker-9dc79.appspot.com",
  messagingSenderId: "771102733664",
  appId: "1:771102733664:web:fd3d6f0007a47da56dda05",
  measurementId: "G-4VP2GXM519"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);