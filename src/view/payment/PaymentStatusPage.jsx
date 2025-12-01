// src/view/payment/PaymentStatusPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PaymentRepository from "../../services/PaymentRepository";
import CourseUnlockRepository from "../../services/CourseUnlockRepository";
import { auth } from "../../services/FirebaseService";

export default function PaymentStatusPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const pid = params.get("pid");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const paymentRepo = new PaymentRepository();

  // ✅ PATCH: empêche le double traitement en dev (React StrictMode)
  const handledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAndHandlePayment() {
      if (!pid) {
        setMsg("❌ pid manquant dans l'URL.");
        setLoading(false);
        return;
      }

      try {
        const p = await paymentRepo.getById(pid);

        if (!p) {
          setMsg("❌ Paiement introuvable.");
          return;
        }

        if (cancelled) return;
        setPayment(p);

        // ✅ PATCH: évite que le SUCCESS soit traité 2 fois
        if (handledRef.current) return;
        handledRef.current = true;

        if (p.status === "SUCCESS") {
          setMsg("✅ Paiement validé !");

          const userId = auth.currentUser?.uid || p.userId;
          await CourseUnlockRepository.unlockCourse(userId, p.courseId);
        } else if (p.status === "FAILED") {
          setMsg("❌ Paiement échoué.");
        } else {
          setMsg("⏳ Paiement en attente de confirmation...");
        }
      } catch (e) {
        console.error(e);
        setMsg("❌ Erreur chargement paiement.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAndHandlePayment();

    return () => {
      cancelled = true;
    };
  }, [pid]);

  if (loading) return <div style={{ padding: 40 }}>Chargement...</div>;

  return (
    <div style={{ padding: "50px", maxWidth: 600, margin: "auto" }}>
      <h1>Statut du paiement</h1>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

      {!payment ? (
        <p>Impossible de récupérer le paiement.</p>
      ) : (
        <>
          <p>
            <b>Cours :</b> {payment.courseId}
          </p>
          <p>
            <b>Montant :</b> {payment.amount} DT
          </p>
          <p>
            <b>Status :</b> {payment.status}
          </p>

          {payment.transactionId && (
            <p>
              <b>Transaction :</b> {payment.transactionId}
            </p>
          )}

          <hr style={{ margin: "20px 0" }} />

          <button
            onClick={() => navigate("/my-courses")}
            style={{
              marginTop: 25,
              padding: "10px 20px",
              background: "#1976d2",
              color: "white",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Voir mes cours
          </button>
        </>
      )}
    </div>
  );
}
