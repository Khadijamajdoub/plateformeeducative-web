// src/view/payment/PaymentStatusPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PaymentRepository from "../../services/PaymentRepository";
import CourseUnlockRepository from "../../services/CourseUnlockRepository";
import { auth } from "../../services/FirebaseService";
import "./PaymentStatusPage.css"; // ✅ UI only

export default function PaymentStatusPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const pid = params.get("pid");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const paymentRepo = new PaymentRepository();
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

        console.log("PAYMENT OBJ =", p);

        if (cancelled) return;
        setPayment(p);

        if (handledRef.current) return;
        handledRef.current = true;

        if (p.status === "SUCCESS") {
          setMsg("✅ Paiement validé !");
          const userId = auth.currentUser?.uid || p.userId;
          await CourseUnlockRepository.unlockCourse(
            userId,
            p.courseId || p.course_id
          );
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
    return () => (cancelled = true);
  }, [pid]);

  if (loading) {
    return (
      <div className="ps-wrapper">
        <div className="ps-card">
          <div className="ps-header">
            <span className="ps-badge">PAYMEE</span>
            <h1>Statut du paiement</h1>
            <p className="ps-muted">Référence: {pid || "—"}</p>
          </div>

          <div className="ps-loading">
            <div className="ps-spinner" />
            <p>Chargement du paiement...</p>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = payment?.status === "SUCCESS";
  const isFailed = payment?.status === "FAILED";

  const courseLabel = payment?.courseId || payment?.course_id || "—";
  const amountLabel =
    payment?.amount ||
    payment?.received_amount ||
    payment?.cost ||
    "—";
  const statusLabel = payment?.status || "—";
  const transactionLabel =
    payment?.transactionId ||
    payment?.transaction_id ||
    payment?.transaction ||
    "—";

  return (
    <div className="ps-wrapper">
      <div className="ps-card">
        <div className="ps-header">
          <span className="ps-badge">PAYMEE</span>
          <h1>Statut du paiement</h1>
          <p className="ps-muted">Référence: {pid}</p>
        </div>

        {msg && (
          <div
            className={`ps-alert ${
              isSuccess ? "success" : isFailed ? "failed" : "pending"
            }`}
          >
            <span className="ps-alert-icon">
              {isSuccess ? "✅" : isFailed ? "❌" : "⏳"}
            </span>
            <span>{msg}</span>
          </div>
        )}

        {!payment ? (
          <div className="ps-empty">
            Impossible de récupérer le paiement.
          </div>
        ) : (
          <>
            <div className="ps-info">
              <div className="ps-row">
                <span className="ps-label">Cours</span>
                <span className="ps-value">{courseLabel}</span>
              </div>

              <div className="ps-row">
                <span className="ps-label">Montant</span>
                <span className="ps-value">{amountLabel} DT</span>
              </div>

              <div className="ps-row">
                <span className="ps-label">Statut</span>
                <span
                  className={`ps-chip ${
                    isSuccess ? "success" : isFailed ? "failed" : "pending"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>

              <div className="ps-row">
                <span className="ps-label">Transaction</span>
                <span className="ps-value mono">{transactionLabel}</span>
              </div>
            </div>

            <div className="ps-actions">
              <button
                onClick={() => navigate("/my-courses")}
                className="ps-btn primary"
              >
                Voir mes cours
              </button>

              <button
                onClick={() => navigate("/")}
                className="ps-btn ghost"
              >
                Retour accueil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
