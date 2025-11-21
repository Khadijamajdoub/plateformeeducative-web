// src/model/PaymentModel.js
export default class PaymentModel {
  constructor({
    id = "",
    userId = "",
    amount = 0,
    status = "pending", // "pending", "success", "failed"
    method = "",
    createdAt = null,
    paymeeTransactionId = "",
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.status = status;
    this.method = method;
    this.createdAt = createdAt;
    this.paymeeTransactionId = paymeeTransactionId;
  }

  // Convertit un document Firestore en PaymentModel
  static fromJson(id, data) {
    return new PaymentModel({
      id,
      userId: data.userId,
      amount: data.amount,
      status: data.status,
      method: data.method,
      createdAt: data.createdAt,
      paymeeTransactionId: data.paymeeTransactionId,
    });
  }

  // Prépare les données pour Firestore
  toJson() {
    return {
      userId: this.userId,
      amount: this.amount,
      status: this.status,
      method: this.method,
      createdAt: this.createdAt,
      paymeeTransactionId: this.paymeeTransactionId,
    };
  }
}
