import React, { useState } from "react";
import { usePaymentViewModel } from "../../viewmodel/PaymentViewModel";

export default function CheckoutPage() {
  const { createPayment, loading, error } = usePaymentViewModel();
  const [amount, setAmount] = useState(20); // Montant par défaut
  const [method] = useState("card"); // Paiement par carte pour sandbox

  const handlePay = async () => {
    try {
      const paymentId = await createPayment({
        userId: "demo-user",
        amount: Number(amount),
        method: method,
      });

      alert("Paiement créé dans Firestore ! ID : " + paymentId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Paiement (Sandbox)</h1>

      <label>Montant :</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginLeft: "10px", marginBottom: "20px" }}
      />

      <br />

      <button onClick={handlePay} disabled={loading}>
        {loading ? "Traitement..." : "Payer"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
