export default class PaymentModel {
  constructor({ userId, amount, method, phone, note, courseId }) {
    this.userId = userId;
    this.amount = amount;
    this.method = method;
    this.phone = phone || "";
    this.note = note || "";
    this.courseId = courseId;
    this.createdAt = new Date().toISOString();
    this.status = "pending"; // par défaut
    this.transactionId = "";
    this.paymentUrl = "";
  }

  toJson() {
    return {
      userId: this.userId,
      amount: this.amount,
      method: this.method,
      phone: this.phone,
      note: this.note,
      courseId: this.courseId,
      createdAt: this.createdAt,
      status: this.status,
      transactionId: this.transactionId,
      paymentUrl: this.paymentUrl,
    };
  }
}
