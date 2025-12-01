// src/services/payment/PaymeeRepository.js
import axios from "axios";

export default class PaymeeRepository {
  constructor(backendPublicUrl) {
    this.backendUrl = String(backendPublicUrl || "")
      .trim()
      .replace(/\/+$/, "");
  }

  async create(payload) {
    if (!this.backendUrl) {
      throw new Error("backendPublicUrl manquant dans PaymeeRepository");
    }

    const res = await axios.post(
      `${this.backendUrl}/api/payments/create`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.data; // { paymentId, payment_url, token }
  }
}
