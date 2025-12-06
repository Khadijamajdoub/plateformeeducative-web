import React from "react";

export default function StudentDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Étudiant</h1>

      <ul>
        <li>Cours achetés : 0</li>
        <li>Quiz complétés : 0</li>
        <li>Progression globale : 0%</li>
      </ul>
    </div>
  );
}
