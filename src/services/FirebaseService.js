import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDb96xfP-Ozl_myCWb_kZnXxUAFzJUa1VA",
  authDomain: "plateformeeducative-e3022.firebaseapp.com",
  projectId: "plateformeeducative-e3022",
  storageBucket: "plateformeeducative-e3022.firebasestorage.app",
  messagingSenderId: "35492940466",
  appId: "1:35492940466:web:3c21e98c283a1c388657ab"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
