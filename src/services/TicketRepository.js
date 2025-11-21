// src/services/TicketRepository.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./FirebaseService";
import TicketModel from "../model/TicketModel";

const ticketsCollection = collection(db, "tickets");

export default class TicketRepository {
  // Lire tous les tickets
  static async getTickets() {
    const snapshot = await getDocs(ticketsCollection);
    return snapshot.docs.map((d) => TicketModel.fromJson(d.id, d.data()));
  }

  // Ajouter un ticket
  static async addTicket(ticketModel) {
    const docRef = await addDoc(ticketsCollection, ticketModel.toJson());
    return docRef.id;
  }

  // Lire un ticket par ID
  static async getTicketById(id) {
    const ref = doc(db, "tickets", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return TicketModel.fromJson(snap.id, snap.data());
  }
}
