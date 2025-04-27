// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5EGKo61VoxVJrSqBdsf4UEWUB3KJ3j2w",
  authDomain: "heartwave-ae5a8.firebaseapp.com",
  projectId: "heartwave-ae5a8",
  storageBucket: "heartwave-ae5a8.firebasestorage.app",
  messagingSenderId: "874676723600",
  appId: "1:874676723600:web:46a29971d0c580b2741d15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app};
export {db};