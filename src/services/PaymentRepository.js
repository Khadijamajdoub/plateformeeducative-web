// src/services/PaymentRepository.js
import { db } from "./FirebaseService";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

/**
 * Repository pour les paiements (collection "payments" dans Firestore)
 */
export default class PaymentRepository {
  static collectionRef() {
    return collection(db, "payments");
  }

  /**
   * Ajoute un nouveau paiement dans Firestore
   * @param {object} paymentData
   * @returns {string} id du document créé
   */
  static async addPayment(paymentData) {
    const docRef = await addDoc(this.collectionRef(), paymentData);
    return docRef.id;
  }

  /**
   * Récupère tous les paiements
   */
  static async getAllPayments() {
    const snapshot = await getDocs(this.collectionRef());
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }

  /**
   * Met à jour le statut d'un paiement (ex: pending -> success)
   */
  static async updatePaymentStatus(paymentId, newStatus) {
    const ref = doc(db, "payments", paymentId);
    await updateDoc(ref, { status: newStatus });
  }
}
