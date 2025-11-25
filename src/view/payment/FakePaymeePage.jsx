import { Link } from "react-router-dom";

export default function FakePaymeePage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Simulation Paymee</h1>
      <p>Cette page simule la redirection Paymee.</p>

      {/* Paiement réussi */}
      <Link
        to="/payment-status?status=success&courseId=course1"
        style={{ display: "block", marginTop: "20px", color: "#4CAF50" }}
      >
        🟢 Retour Paiement Réussi
      </Link>

      {/* Paiement échoué */}
      <Link
        to="/payment-status?status=failed&courseId=course1"
        style={{ display: "block", marginTop: "20px", color: "#f44336" }}
      >
        🔴 Retour Paiement Échoué
      </Link>
    </div>
  );
}
