// src/viewmodel/PaymentViewModel.js
import { useState, useRef } from "react";
import axios from "axios";
import { auth } from "../services/FirebaseService";

export function usePaymentViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inFlightRef = useRef(false);

  async function startCheckout({
    courseId,
    amount,
    phone,
    returnBaseUrl,
    backendPublicUrl,

    // ✅ AJOUTÉS
    email,
    fullName,
  }) {
    if (inFlightRef.current) return false;
    inFlightRef.current = true;

    setLoading(true);
    setError("");

    try {
      const user =
        auth.currentUser || {
          uid: "demo-user",
          email: email || "demo@paymee.tn",      // ✅ prend email tapé
          displayName: fullName || "Demo User", // ✅ prend nom tapé
        };

      if (!courseId) throw new Error("Cours non choisi.");
      const amt = Number(amount);
      if (!amt || amt <= 0) throw new Error("Montant invalide.");

      const cleanBase = (url) =>
        String(url || "").trim().replace(/\/+$/, "");

      const cleanBackendUrl =
        cleanBase(backendPublicUrl) ||
        cleanBase(returnBaseUrl) ||
        cleanBase(import.meta.env.VITE_BACKEND_URL) ||
        cleanBase(window.location.origin);

      if (!cleanBackendUrl) throw new Error("URL backend introuvable.");

      const displayParts = (user.displayName || "Demo User").split(" ");
      const firstName = displayParts[0] || "User";
      const lastName = displayParts.slice(1).join(" ") || "Demo";

      const res = await axios.post(
        `${cleanBackendUrl}/api/payments/create`,
        {
          courseId,
          amount: amt,
          phone: phone?.trim() || "11111111",
          userId: user.uid,
          email: user.email,
          firstName,
          lastName,
          baseUrl: cleanBase(returnBaseUrl) || cleanBackendUrl,
        }
      );

      const { payment_url } = res.data || {};
      if (!payment_url) throw new Error("payment_url manquante");

      window.location.assign(payment_url);
      return true;
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message);
      return false;
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  return { startCheckout, loading, error };
}
