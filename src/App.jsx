import React from "react";
import { Routes, Route } from "react-router-dom";

import CheckoutPage from "./view/payment/CheckoutPage";
import AdminDashboard from "./view/admin/AdminDashboard";
import StudentHome from "./view/student/StudentHome";
import VisitorHome from "./view/visitor/VisitorHome";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/student" element={<StudentHome />} />
      <Route path="/visitor" element={<VisitorHome />} />
    </Routes>
  );
}
