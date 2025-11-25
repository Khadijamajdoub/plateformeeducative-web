// src/services/payment/PaymeeService.js
import axios from "axios";

// 🟣 Active / désactive la simulation ici
// true  = pas d'appel à Paymee, tout est simulé (idéal pour ton projet de classe)
// false = appelle vraiment l'API Paymee Sandbox (quand elle refonctionnera)
const USE_SIMULATION = true;

// 🔵 Ces valeurs serviront PLUS TARD quand tu voudras utiliser la vraie API
const PAYMEE_BASE_URL = "https://sandbox.paymee.tn/api/v2";
const PAYMEE_API_KEY = "YOUR_PAYMEE_API_KEY";
const RETURN_URL = "http://localhost:5173/payment-status";

export default class PaymeeService {
  /**
   * Crée un paiement (simulé ou réel)
   * amount: nombre (montant en DT)
   * note: string (description)
   * buyerPhone: string (optionnel)
   */
  static async createPayment(amount, note, buyerPhone = "") {
    // 🟣 MODE SIMULATION : aucune dépendance à Paymee
    if (USE_SIMULATION) {
      console.warn("PaymeeService: MODE SIMULATION activé (aucun appel à Paymee).");

      const fakeTransactionId = `SIM_${Date.now()}`;
      const fakePaymentUrl = `http://localhost:5173/fake-paymee?transactionId=${fakeTransactionId}&amount=${amount}`;

      // On renvoie un objet qui ressemble à ce que renverrait Paymee
      return {
        transaction_id: fakeTransactionId,
        payment_url: fakePaymentUrl,
        note,
        buyerPhone,
      };
    }

    // 🔵 MODE RÉEL : uniquement quand tu mettras USE_SIMULATION = false et une vraie clé
    try {
      const response = await axios.post(
        `${PAYMEE_BASE_URL}/payments/create`,
        {
          amount,
          note,
          buyer_phone: buyerPhone,
          return_url: RETURN_URL,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${PAYMEE_API_KEY}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erreur Paymee createPayment:", error);
      throw error;
    }
  }
}
