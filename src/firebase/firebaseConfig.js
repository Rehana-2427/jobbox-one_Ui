// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDmluC7H381PC5B8O-YaxTer1vEaCsSsU",
  authDomain: "jobbox-f990a.firebaseapp.com",
  // authDomain: "jobbox.one",
  projectId: "jobbox-f990a",
  storageBucket: "jobbox-f990a.appspot.com",
  messagingSenderId: "942823069747",
  appId: "1:942823069747:web:98f8bea03ac387b41feb46",
  measurementId: "G-SSNWMK0T17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export default app;