// src/viewmodel/PaymentViewModel.js
import { useState } from "react";
import PaymeeService from "../services/payment/PaymeeService";
import PaymentRepository from "../services/PaymentRepository";
import CourseUnlockRepository from "../services/CourseUnlockRepository"; 

/**
 * ViewModel pour gérer la logique de paiement + déblocage de cours
 */
export function usePaymentViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);

  /**
   * Crée un paiement + débloque un cours
   */
  const createPayment = async (paymentData) => {
    const { amount, userId, courseId, note = "Achat cours", phone = "" } = paymentData;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Appel Paymee (simulé)
      const response = await PaymeeService.createPayment(amount, note, phone);

      // 2️⃣ Enregistrement dans Firestore
      const paymentId = await PaymentRepository.addPayment({
        amount,
        note,
        phone,
        transactionId: response.transaction_id,
        paymentUrl: response.payment_url,
        status: "pending",
        createdAt: new Date().toISOString(),
        userId,
        courseId
      });

      // 3️⃣ Débloquer le cours pour cet utilisateur
      await CourseUnlockRepository.unlockCourse(userId, courseId);

      // 4️⃣ Mettre à jour l’UI
      setLastPayment({
        id: paymentId,
        amount,
        transactionId: response.transaction_id,
        paymentUrl: response.payment_url
      });

      // 5️⃣ Retourner le résultat
      return {
        id: paymentId,
        paymentUrl: response.payment_url
      };
    } catch (err) {
      console.error("Erreur createPayment:", err);
      setError("Erreur lors de la création du paiement.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    lastPayment,
    createPayment,
  };
}
