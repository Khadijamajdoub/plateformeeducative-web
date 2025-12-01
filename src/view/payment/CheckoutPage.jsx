// src/view/payment/CheckoutPage.jsx
import React, { useState } from "react";
import { usePaymentViewModel } from "../../viewmodel/PaymentViewModel";

export default function CheckoutPage() {
  const { startCheckout, loading, error } = usePaymentViewModel();

  const [courseId, setCourseId] = useState("course1");
  const [amount, setAmount] = useState(20);
  const [phone, setPhone] = useState("");

  // ✅ ton ngrok backend (public)
  const BACKEND_URL = "https://hypothecary-elli-uncalorific.ngrok-free.dev";

  const handlePay = async () => {
    const ok = await startCheckout({
      courseId,
      amount: Number(amount),
      phone: phone.trim() || "11111111",

      // ✅ Paymee doit recevoir une URL publique
      returnBaseUrl: BACKEND_URL,

      backendPublicUrl: BACKEND_URL,
    });

    if (!ok) alert("Erreur lors de la création du paiement.");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h1>Paiement du cours</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Cours à acheter :</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="course1">Cours 1 : Mathématiques</option>
          <option value="course2">Cours 2 : Physique</option>
          <option value="course3">Cours 3 : Informatique</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Montant :</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Téléphone :</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ex: 11111111 (sandbox)"
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
          borderRadius: "6px",
        }}
      >
        {loading ? "Traitement..." : "Payer"}
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
}
