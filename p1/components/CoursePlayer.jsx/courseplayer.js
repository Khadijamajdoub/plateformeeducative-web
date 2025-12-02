// src/components/CoursePlayer.jsx
import React, { useEffect } from "react";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

export default function CoursePlayer({ lesson, isPreview }) {
  useEffect(() => {
    // si on veut auto-save la vue quand le composant est monté
  }, [lesson]);

  const onComplete = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      [`progress.${lesson.courseId}.completedLessons`]: arrayUnion(lesson.id),
    });
    alert("Leçon marquée comme complétée !");
  };

  if (!lesson) return <div>Aperçu non disponible</div>;

  return (
    <div>
      {lesson.type === "video" ? (
        <video controls src={lesson.videoUrl} style={{ width: "100%" }} />
      ) : (
        <div>{/* autre type */}</div>
      )}
      {!isPreview && <button onClick={onComplete}>Marquer comme terminée</button>}
    </div>
  );
}
