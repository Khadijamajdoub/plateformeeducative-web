// src/pages/Course.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import PurchaseButton from "../components/PurchaseButton";
import CoursePlayer from "../components/CoursePlayer";
import { AuthContext } from "../contexts/AuthContext";

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      const d = await getDoc(doc(db, "courses", id));
      if (d.exists()) setCourse({ id: d.id, ...d.data() });
    };
    load();
  }, [id]);

  if (!course) return <div>Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p>{course.description}</p>
      <div className="mt-4">
        <h2 className="font-semibold">Programme</h2>
        <ul>
          {course.sections?.map(sec => (
            <li key={sec.id}>
              <strong>{sec.title}</strong>
              <ul>
                {sec.lessons?.map(lesson => (
                  <li key={lesson.id}>{lesson.title} {lesson.preview ? "(Aperçu)" : ""}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        {course.price ? (
          <PurchaseButton course={course} user={user} />
        ) : (
          <div>Ce cours est gratuit — tu peux accéder aux leçons.</div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Leçon d’aperçu</h2>
        <CoursePlayer lesson={course.sections?.[0]?.lessons?.[0]} isPreview />
      </div>
    </div>
  );
}
