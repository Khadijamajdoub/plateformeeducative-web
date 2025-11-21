// src/services/admin/AdminRepository.js
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import { db } from "../FirebaseService";
import UserModel from "../../model/admin/UserModel";
import CourseModel from "../../model/admin/CourseModel";
import PromoModel from "../../model/admin/PromoModel";

export default class AdminRepository {
  // USERS
  static async getAllUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => UserModel.fromJson(doc.id, doc.data()));
  }

  static async deleteUser(userId) {
    await deleteDoc(doc(db, "users", userId));
  }

  // COURSES
  static async getAllCourses() {
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map(doc => CourseModel.fromJson(doc.id, doc.data()));
  }

  static async addCourse(courseModel) {
    return await addDoc(collection(db, "courses"), courseModel.toJson());
  }

  // PROMOTIONS
  static async getPromos() {
    const snapshot = await getDocs(collection(db, "promos"));
    return snapshot.docs.map(doc => PromoModel.fromJson(doc.id, doc.data()));
  }
}
