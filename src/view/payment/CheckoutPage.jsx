import React, { useState } from "react";
import { usePaymentViewModel } from "../../viewmodel/PaymentViewModel";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { startCheckout, loading, error } = usePaymentViewModel();

  const [courseId, setCourseId] = useState("course1");
  const [amount, setAmount] = useState(20);
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const BACKEND_URL = "https://hypothecary-elli-uncalorific.ngrok-free.dev";

  const handlePay = async () => {
    if (!email.trim() || !fullName.trim()) {
      alert("Veuillez saisir votre nom et email pour le test.");
      return;
    }

    const ok = await startCheckout({
      courseId,
      amount: Number(amount),
      phone: phone.trim() || "11111111",

      returnBaseUrl: BACKEND_URL,
      backendPublicUrl: BACKEND_URL,

      email: email.trim(),
      fullName: fullName.trim(),
    });

    if (!ok) alert("Erreur lors de la création du paiement.");
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-card">
        <div className="checkout-header">
          <span className="checkout-badge">PAYMEE SANDBOX</span>
          <div>
            <div className="checkout-title">Paiement du cours</div>
            <div className="checkout-subtitle">
              Finalisez votre achat pour débloquer le contenu complet
            </div>
          </div>
        </div>

        {/* ✅ Cours */}
        <div className="form-grid">
          <div className="form-group">
            <label>Cours à acheter</label>
            <select
              className="form-select"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="course1">Cours 1 : Mathématiques</option>
              <option value="course2">Cours 2 : Physique</option>
              <option value="course3">Cours 3 : Informatique</option>
            </select>
          </div>
        </div>

        {/* ✅ Montant + Phone */}
        <div className="form-grid two-cols">
          <div className="form-group">
            <label>Montant (DT)</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              className="form-control"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 11111111 (sandbox)"
            />
            <span className="form-hint">Numéro de test sandbox accepté</span>
          </div>
        </div>

        {/* ✅ FullName + Email */}
        <div className="form-grid two-cols">
          <div className="form-group">
            <label>Nom complet</label>
            <input
              className="form-control"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Khadija Ben Ali"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: khadija@gmail.com"
            />
          </div>
        </div>

        {/* ✅ Résumé */}
        <div className="summary-box">
          <span>Total à payer</span>
          <b>{Number(amount || 0)} DT</b>
        </div>

        {/* ✅ Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="checkout-btn"
        >
          {loading ? "Traitement..." : "Payer maintenant"}
        </button>

        {error && <div className="checkout-error">{error}</div>}
      </div>
    </div>
  );
}
