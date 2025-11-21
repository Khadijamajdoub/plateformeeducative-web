// src/services/PaymentRepository.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./FirebaseService";
import PaymentModel from "../model/PaymentModel";

const paymentsCollection = collection(db, "payments");

export default class PaymentRepository {
  // Récupérer tous les paiements
  static async getPayments() {
    const snapshot = await getDocs(paymentsCollection);
    return snapshot.docs.map((d) => PaymentModel.fromJson(d.id, d.data()));
  }

  // Ajouter un paiement
  static async addPayment(paymentModel) {
    const docRef = await addDoc(paymentsCollection, paymentModel.toJson());
    return docRef.id;
  }

  // Mettre à jour un paiement existant
  static async updatePayment(paymentModel) {
    if (!paymentModel.id) {
      throw new Error("PaymentModel.id est obligatoire pour update");
    }
    const ref = doc(db, "payments", paymentModel.id);
    await updateDoc(ref, paymentModel.toJson());
  }

  // Supprimer un paiement
  static async deletePayment(id) {
    const ref = doc(db, "payments", id);
    await deleteDoc(ref);
  }
}
