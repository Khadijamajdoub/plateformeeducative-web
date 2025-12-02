// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CourseCard from "../components/CourseCard";

export default function Home() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "courses"), where("published", "==", true));
    getDocs(q).then(snap => {
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);
  return (
    <div>
      <h1 className="text-2xl mb-4">Catalogue</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map(c => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}
