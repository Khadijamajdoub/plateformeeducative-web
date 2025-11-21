// src/services/visitor/VisitorRepository.js
import { db } from "../FirebaseService";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import ClubModel from "../../model/student/ClubModel";

export default class VisitorRepository {
  // Clubs publics
  static async getPublicClubs() {
    const snapshot = await getDocs(collection(db, "clubs"));
    return snapshot.docs.map(doc => ClubModel.fromJson(doc.id, doc.data()));
  }

  // Recherche de clubs par nom
  static async searchClubs(keyword) {
    const q = query(
      collection(db, "clubs"),
      where("name", ">=", keyword),
      where("name", "<=", keyword + "\uf8ff")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ClubModel.fromJson(doc.id, doc.data()));
  }
}
