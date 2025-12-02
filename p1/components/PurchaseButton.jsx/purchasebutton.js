// src/components/PurchaseButton.jsx
import React, { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function PurchaseButton({ course, user }) {
  const [loading, setLoading] = useState(false);

  const onBuy = async () => {
    if (!user) return alert("Connecte-toi d'abord.");
    setLoading(true);
    try {
      // 1) créer un document payment pending (optionnel mais utile)
      const paymentRef = doc(db, "payments", `${user.uid}_${course.id}_${Date.now()}`);
      await setDoc(paymentRef, {
        userId: user.uid,
        courseId: course.id,
        amount: course.price || 0,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // 2) appeler la Cloud Function (adapter selon ton endpoint)
      const res = await fetch(import.meta.env.VITE_PAYMENT_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentDocId: paymentRef.id,
          userId: user.uid,
          courseId: course.id,
          amount: course.price || 0,
        }),
      });
      const data = await res.json();
      // data.paymentUrl attendu
      if (data.paymentUrl) {
        // redirection vers Paymee (sandbox)
        window.location.href = data.paymentUrl;
      } else {
        alert("Erreur lors de la création du paiement.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur: " + err.message);
      setLoading(false);
    }
  };

  return (
    <button onClick={onBuy} disabled={loading} className="btn">
      {loading ? "Préparation..." : `Acheter ce cours — ${(course.price/100).toFixed(2)} TND`}
    </button>
  );
}
