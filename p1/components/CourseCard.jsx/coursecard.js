// src/components/CourseCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="border rounded p-3">
      <img src={course.coverURL} alt={course.title} className="w-full h-40 object-cover" />
      <h3 className="text-lg font-semibold mt-2">{course.title}</h3>
      <p className="text-sm">{course.description?.slice(0,120)}...</p>
      <div className="mt-3 flex justify-between items-center">
        <Link to={`/course/${course.id}`} className="btn">Voir</Link>
        <span>{course.price ? (course.price/100).toFixed(2) + " TND" : "Gratuit"}</span>
      </div>
    </div>
  );
}
