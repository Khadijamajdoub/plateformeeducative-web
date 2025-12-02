// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const onEmailLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, pass);
    nav("/");
  };

  const onGoogle = async () => {
    await signInWithPopup(auth, provider);
    nav("/");
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Connexion</h2>
      <form onSubmit={onEmailLogin} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Mot de passe" />
        <button type="submit">Se connecter</button>
      </form>
      <hr />
      <button onClick={onGoogle}>Se connecter avec Google</button>
    </div>
  );
}
