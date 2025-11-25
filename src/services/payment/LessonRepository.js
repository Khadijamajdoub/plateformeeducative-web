// src/services/LessonRepository.js

import { db } from "./FirebaseService";
import { collection, getDocs } from "firebase/firestore";
import LessonModel from "../model/student/LessonModel";

/**
 * Lecture des leçons d'un cours
 * (C'est SANA qui les crée, toi tu les lis)
 */
export default class LessonRepository {
  static async getLessons(courseId) {
    const snap = await getDocs(
      collection(db, "courses", courseId, "lessons")
    );

    return snap.docs.map((d) =>
      LessonModel.fromJson(d.id, d.data())
    );
  }
}
