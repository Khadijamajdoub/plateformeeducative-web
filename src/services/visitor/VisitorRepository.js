// src/services/visitor/VisitorRepository.js
import { db } from "../FirebaseService";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import CourseModel from "../../model/student/CourseModel";

export default class VisitorRepository {
  // Cours publics
  static async getPublicCourses() {
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map((docu) =>
      CourseModel.fromJson(docu.id, docu.data())
    );
  }

  // Recherche de cours par titre
  static async searchCourses(keyword) {
    const q = query(
      collection(db, "courses"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docu) =>
      CourseModel.fromJson(docu.id, docu.data())
    );
  }
}
