import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ navigation automatique

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Simulation de connexion (pour l’instant)
    if (email && password) {
      console.log("Connexion réussie !");
      navigate("/student/dashboard"); // ✅ REDIRECTION AUTOMATIQUE
    } else {
      alert("Veuillez remplir tous les champs");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Connexion Étudiant</h1>

      <form onSubmit={handleLogin} style={{ maxWidth: "400px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button type="submit" style={{ padding: "10px 20px" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}
