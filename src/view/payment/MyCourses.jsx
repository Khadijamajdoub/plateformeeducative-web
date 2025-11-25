// src/view/payment/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/FirebaseService";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const userId = "demo-user"; // plus tard => vrai user connecté
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const userRef = doc(db, "userCourses", userId);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setCourses(snap.data()); // { course1: true, course2: true }
        }
      } catch (e) {
        console.error("Erreur MyCourses :", e);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Chargement...</p>;

  const unlockedList = Object.keys(courses).filter((c) => courses[c] === true);

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>📚 Mes cours débloqués</h1>

      {unlockedList.length === 0 ? (
        <p>Aucun cours débloqué pour l’instant.</p>
      ) : (
        <ul style={{ marginTop: "20px" }}>
          {unlockedList.map((courseId) => (
            <li key={courseId} style={{ marginBottom: "15px" }}>
              <strong>{courseId}</strong>

              <br />

              <Link
                to={`/course/${courseId}`}
                style={{
                  marginTop: "5px",
                  display: "inline-block",
                  background: "#007bff",
                  padding: "8px 14px",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
              >
                Voir le cours →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
