// src/services/student/StudentRepository.js
import { db } from "../FirebaseService";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import CourseModel from "../../model/student/CourseModel";
import ApplicationModel from "../../model/student/ApplicationModel";
import StudentModel from "../../model/student/StudentModel";

export default class StudentRepository {
  // Liste des cours
  static async getCourses() {
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map((docu) =>
      CourseModel.fromJson(docu.id, docu.data())
    );
  }

  // "Candidature" à un cours → tu peux l’adapter en inscription/achat plus tard
  static async applyToCourse(applicationModel) {
    return await addDoc(
      collection(db, "applications"),
      applicationModel.toJson()
    );
  }

  // Mise à jour profil étudiant
  static async updateStudent(studentId, studentModel) {
    await updateDoc(doc(db, "users", studentId), studentModel.toJson());
  }
}
