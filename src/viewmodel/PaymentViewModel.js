// src/viewmodel/PaymentViewModel.js
import { useState, useRef } from "react";
import axios from "axios";
import { auth } from "../services/FirebaseService";

export function usePaymentViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ évite double checkout (double click / rerender react)
  const inFlightRef = useRef(false);

  async function startCheckout({
    courseId,
    amount,
    phone,
    returnBaseUrl,
    backendPublicUrl,
  }) {
    if (inFlightRef.current) return false; // stop double call
    inFlightRef.current = true;

    setLoading(true);
    setError("");

    try {
      const user =
        auth.currentUser || {
          uid: "demo-user",
          email: "demo@paymee.tn",
          displayName: "Demo User",
        };

      if (!courseId) throw new Error("Cours non choisi.");
      const amt = Number(amount);
      if (!amt || amt <= 0) throw new Error("Montant invalide.");

      // ✅ On accepte une seule URL :
      // 1) backendPublicUrl si fourni
      // 2) sinon returnBaseUrl
      // 3) sinon env vite
      // 4) sinon origin du navigateur
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

          // ✅ le backend construit return_url/cancel_url via baseUrl
          // si tu as une seule URL => elle suffit ici
          baseUrl: cleanBase(returnBaseUrl) || cleanBackendUrl,
        }
      );

      const { payment_url } = res.data || {};
      if (!payment_url) throw new Error("payment_url manquante");

      // ✅ redirection Paymee
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
