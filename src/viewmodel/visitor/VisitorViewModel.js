// src/viewmodel/visitor/VisitorViewModel.js
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/FirebaseService";
import AuthService from "../../services/visitor/AuthService";
import VisitorRepository from "../../services/visitor/VisitorRepository";

export function useVisitorViewModel() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // null => internaute
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);

      if (u) {
        const p = await VisitorRepository.getProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return {
    firebaseUser,
    profile,
    loading,
    register: AuthService.register,
    login: AuthService.login,
    loginGoogle: AuthService.loginWithGoogle,
    logout: AuthService.logout,
  };
}
