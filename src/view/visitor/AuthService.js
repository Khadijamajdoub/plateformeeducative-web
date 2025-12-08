import { auth, db } from "../FirebaseService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default class AuthService {
  // ✅ Register => crée un compte student par défaut
  static async register({ fullName, email, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid,
        fullName: fullName?.trim() || "",
        email: email?.trim() || "",
        role: "student", // ✅ default
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return cred.user;
  }

  static async login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  static async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    const uid = cred.user.uid;
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid,
        fullName: cred.user.displayName || "",
        email: cred.user.email || "",
        role: "student",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return cred.user;
  }

  static async logout() {
    await signOut(auth);
  }
}
