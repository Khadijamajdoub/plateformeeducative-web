// src/view/payment/CheckoutPage.jsx

import React, { useState } from "react";
import { usePaymentViewModel } from "../../viewmodel/PaymentViewModel";

export default function CheckoutPage() {
  const { createPayment, loading, error } = usePaymentViewModel();

  const [courseId, setCourseId] = useState("");
  const [amount, setAmount] = useState(20);
  const [phone, setPhone] = useState("");

  const userId = "demo-user"; // plus tard : remplacer par utilisateur connecté

  const handlePay = async () => {
    if (!courseId) {
      alert("❗ Vous devez choisir un cours.");
      return;
    }

    const result = await createPayment({
      amount,
      note: `Achat du cours : ${courseId}`,
      phone,
      userId,
      courseId,
    });

    if (!result) {
      alert("Erreur lors de la création du paiement.");
      return;
    }

    window.location.href = result.paymentUrl; // simulation Paymee
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h1>Paiement du cours</h1>

      {/* Sélecteur de cours */}
      <div style={{ marginBottom: "20px" }}>
        <label>Cours à acheter :</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="">-- Choisir un cours --</option>
          <option value="course1">Cours 1 : Mathématiques</option>
          <option value="course2">Cours 2 : Physique</option>
          <option value="course3">Cours 3 : Informatique</option>
        </select>
      </div>

      {/* Montant */}
      <div style={{ marginBottom: "20px" }}>
        <label>Montant :</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      {/* Téléphone */}
      <div style={{ marginBottom: "20px" }}>
        <label>Téléphone (optionnel) :</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Traitement..." : "Payer"}
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
}
