import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAE_BvnwDRlYR9gQXPuDnJAASCKkBUw7UE",
  authDomain: "tu-sueldo-en-dolares.firebaseapp.com",
  projectId: "tu-sueldo-en-dolares",
  storageBucket: "tu-sueldo-en-dolares.appspot.com",
  messagingSenderId: "267565913728",
  appId: "1:267565913728:web:dd63f4c48846554a307865",
  measurementId: "G-GDECMNTKLV",
};
// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
