import React from "react";

export default function StudentCourses() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Catalogue des cours</h1>

      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <h3>React.js débutant</h3>
        <p>Prix : 20 TND</p>
        <button>Acheter</button>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h3>Flutter Avancé</h3>
        <p>Prix : 30 TND</p>
        <button>Acheter</button>
      </div>
    </div>
  );
}
