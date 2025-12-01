// src/services/PaymentRepository.js
import { db } from "./FirebaseService";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default class PaymentRepository {
  constructor() {
    this.ref = collection(db, "payments");
  }

  async create(paymentData) {
    const docRef = await addDoc(this.ref, {
      ...paymentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getById(paymentId) {
    const refDoc = doc(db, "payments", paymentId);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  }

  async updateStatus(paymentId, status, extra = {}) {
    const refDoc = doc(db, "payments", paymentId);
    await updateDoc(refDoc, {
      status,
      ...extra,
      updatedAt: serverTimestamp(),
    });
  }

  async getAll() {
    const snapshot = await getDocs(this.ref);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}
