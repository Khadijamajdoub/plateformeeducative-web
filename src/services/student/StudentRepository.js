// src/services/student/StudentRepository.js
import { db } from "../FirebaseService";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import ClubModel from "../../model/student/ClubModel";
import ApplicationModel from "../../model/student/ApplicationModel";
import StudentModel from "../../model/student/StudentModel";

export default class StudentRepository {
  // Clubs publics
  static async getClubs() {
    const snapshot = await getDocs(collection(db, "clubs"));
    return snapshot.docs.map(doc => ClubModel.fromJson(doc.id, doc.data()));
  }

  // Candidature
  static async applyToClub(applicationModel) {
    return await addDoc(collection(db, "applications"), applicationModel.toJson());
  }

  // Mise à jour profil étudiant
  static async updateStudent(studentId, studentModel) {
    await updateDoc(doc(db, "users", studentId), studentModel.toJson());
  }
}
