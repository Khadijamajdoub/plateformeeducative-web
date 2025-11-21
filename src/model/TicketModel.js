// src/model/TicketModel.js
export default class TicketModel {
  constructor({
    id = "",
    userId = "",
    paymentId = "",
    clubId = "",
    eventId = "",
    qrCodeUrl = "",
    createdAt = null,
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.paymentId = paymentId;
    this.clubId = clubId;
    this.eventId = eventId;
    this.qrCodeUrl = qrCodeUrl;
    this.createdAt = createdAt;
  }

  // Pour transformer un document Firestore en TicketModel
  static fromJson(id, data) {
    return new TicketModel({
      id,
      userId: data.userId,
      paymentId: data.paymentId,
      clubId: data.clubId,
      eventId: data.eventId,
      qrCodeUrl: data.qrCodeUrl,
      createdAt: data.createdAt,
    });
  }

  // Pour envoyer vers Firestore
  toJson() {
    return {
      userId: this.userId,
      paymentId: this.paymentId,
      clubId: this.clubId,
      eventId: this.eventId,
      qrCodeUrl: this.qrCodeUrl,
      createdAt: this.createdAt,
    };
  }
}
