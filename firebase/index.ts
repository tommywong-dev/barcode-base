// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7WHPmADQiV0jHRt0mj5ypGiywZY9ETwI",
  authDomain: "barcode-base.firebaseapp.com",
  projectId: "barcode-base",
  storageBucket: "barcode-base.appspot.com",
  messagingSenderId: "1079503993145",
  appId: "1:1079503993145:web:d57d3667fef9967c2810e8",
  measurementId: "G-WVDY6DN91M",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
