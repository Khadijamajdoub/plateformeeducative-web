// src/viewmodel/PaymentViewModel.js
import { useState } from "react";
import PaymentRepository from "../services/PaymentRepository";
import PaymentModel from "../model/PaymentModel";

export function usePaymentViewModel() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger tous les paiements
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PaymentRepository.getPayments();
      setPayments(data);
    } catch (e) {
      console.error(e);
      setError(e.message || "Erreur lors du chargement des paiements");
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau paiement
  const createPayment = async ({ userId, amount, method }) => {
    try {
      setLoading(true);
      setError(null);

      const payment = new PaymentModel({
        userId,
        amount,
        method,
        status: "pending",
        createdAt: new Date(),
      });

      const id = await PaymentRepository.addPayment(payment);

      // Option : mettre à jour la liste
      await fetchPayments();

      return id;
    } catch (e) {
      console.error(e);
      setError(e.message || "Erreur lors de la création du paiement");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createPayment,
  };
}
