import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import CheckoutPage from "./view/payment/CheckoutPage";
import AdminDashboard from "./view/admin/AdminDashboard";
import StudentHome from "./view/student/StudentHome";
import VisitorHome from "./view/visitor/VisitorHome";

export default function App() {
  return (
    <div>
      <nav style={{ padding: "10px", background: "#f0f0f0", marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "15px" }}>Checkout</Link>
        <Link to="/admin" style={{ marginRight: "15px" }}>Admin</Link>
        <Link to="/student" style={{ marginRight: "15px" }}>Étudiant</Link>
        <Link to="/visitor" style={{ marginRight: "15px" }}>Visiteur</Link>
      </nav>

      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentHome />} />
        <Route path="/visitor" element={<VisitorHome />} />
      </Routes>
    </div>
  );
}
