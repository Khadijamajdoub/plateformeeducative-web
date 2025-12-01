// src/services/payment/PaymeeService.js
import axios from "axios";

const PAYMEE_ENV = import.meta.env.VITE_PAYMEE_ENV || "sandbox"; 
// "sandbox" ou "prod"

const PAYMEE_BASE =
  PAYMEE_ENV === "prod"
    ? "https://app.paymee.tn"
    : "https://sandbox.paymee.tn";

const PAYMEE_CREATE_URL = `${PAYMEE_BASE}/api/v2/payments/create`;
const PAYMEE_API_KEY = import.meta.env.VITE_PAYMEE_KEY;

export default class PaymeeService {
  static async createPayment(payload) {
    if (!PAYMEE_API_KEY) {
      throw new Error("VITE_PAYMEE_KEY manquante dans .env");
    }

    try {
      const response = await axios.post(PAYMEE_CREATE_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${PAYMEE_API_KEY}`,
        },
      });

      const data = response.data;
      console.log("PAYMEE RAW RESPONSE =>", data);

      if (data?.status === false) {
        throw new Error(data?.message || "Paymee rejected the payment");
      }

      // ✅ Normalisation : Paymee peut renvoyer data.data
      const paymeeData = data?.data || data;

      return paymeeData;
    } catch (error) {
      console.error("PAYMEE ERROR =>", error?.response?.data || error);
      throw new Error(
        error?.response?.data?.message ||
        error?.message ||
        "Paymee createPayment failed"
      );
    }
  }
}
