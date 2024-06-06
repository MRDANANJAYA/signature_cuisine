// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const  initializeFirebase = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCp8krCqFerZ9QKELxi98_c9l0rOxNA-Z4",
    authDomain: "signature-cuisine.firebaseapp.com",
    projectId: "signature-cuisine",
    storageBucket: "signature-cuisine.appspot.com",
    messagingSenderId: "1067124080087",
    appId: "1:1067124080087:web:20e800ce5691b57da41f92",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  return app;
};
