// src/pages/Signup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const onSignup = async (e) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, pass);
    nav("/");
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Inscription</h2>
      <form onSubmit={onSignup} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Mot de passe" />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
