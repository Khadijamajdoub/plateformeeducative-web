// src/services/CourseUnlockRepository.js

import { db } from "./FirebaseService";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Gère le déblocage des cours pour les utilisateurs
 */
export default class CourseUnlockRepository {
  
  /**
   * Débloque un cours pour un utilisateur
   */
  static async unlockCourse(userId, courseId) {
    const ref = doc(db, "userCourses", userId);

    await setDoc(
      ref,
      { [courseId]: true },
      { merge: true } // n'efface pas les autres cours débloqués
    );

    return true;
  }

  /**
   * Vérifie si un cours est déjà débloqué
   */
  static async isCourseUnlocked(userId, courseId) {
    const ref = doc(db, "userCourses", userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return false;

    return snap.data()[courseId] === true;
  }

  /**
   * Récupère TOUS les cours débloqués par un utilisateur
   */
  static async getUnlockedCourses(userId) {
    const ref = doc(db, "userCourses", userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return {};

    return snap.data(); // ex : { course1: true, course2: true }
  }
}
