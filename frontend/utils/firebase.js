// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
//   authDomain: "lakshyalms.firebaseapp.com",
//   projectId: "lakshyalms",
//   storageBucket: "lakshyalms.firebasestorage.app",
//   messagingSenderId: "620034797497",
//   appId: "1:620034797497:web:62ae3d918a03ad80821068",
// };
const firebaseConfig = {
  // apiKey: "AIzaSyCvYzHWGmA6IKDqowkeEleXhISjSTuNjSE",
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "lakshyalms.firebaseapp.com",
  projectId: "lakshyalms",
  storageBucket: "lakshyalms.firebasestorage.app",
  messagingSenderId: "620034797497",
  appId: "1:620034797497:web:fbc5185e90a5ed92821068",
};
// console.log("API KEY:", import.meta.env.VITE_FIREBASE_APIKEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
