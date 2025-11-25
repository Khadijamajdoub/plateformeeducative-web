// src/view/payment/CourseViewer.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import LessonRepository from "../../services/LessonRepository";
import CourseUnlockRepository from "../../services/CourseUnlockRepository";

export default function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = "demo-user"; // 🔥 À remplacer plus tard par ton auth Firebase

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);

      // 1️⃣ Vérifier si le cours est débloqué
      const unlocked = await CourseUnlockRepository.isCourseUnlocked(
        userId,
        courseId
      );

      setIsUnlocked(unlocked);

      // 2️⃣ Charger la liste des leçons
      if (unlocked) {
        const data = await LessonRepository.getLessons(courseId);
        setLessons(data);
      }

      setLoading(false);
    };

    loadCourse();
  }, [courseId]);

  if (loading) return <p>Chargement...</p>;

  // 🛑 Cours pas débloqué → redirige
  if (!isUnlocked) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Accès refusé</h2>
        <p>Ce cours n’a pas été débloqué.</p>
        <button onClick={() => navigate("/checkout")}>
          Acheter ce cours
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>📘 Contenu du cours</h1>

      {lessons.length === 0 ? (
        <p>Aucune leçon trouvée pour ce cours.</p>
      ) : (
        <ul>
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
            >
              {lesson.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
