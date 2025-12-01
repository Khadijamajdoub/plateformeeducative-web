import React from "react";
import ReactDOM from "react-dom/client";

// 👉 Import Router + Routes
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import PaymentStatusPage from "./view/payment/PaymentStatusPage.jsx"; 
import CheckoutPage from "./view/payment/CheckoutPage.jsx";
import MyCourses from "./view/payment/MyCourses.jsx"; // 🔵 AJOUT ICI
import CourseViewer from "./view/payment/CourseViewer.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

  {/* Page principale */}
  <Route path="/" element={<App />} />

  {/* Paiement */}
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/payment-status" element={<PaymentStatusPage />} />

<Route path="/my-courses" element={<MyCourses />} />


  {/* Voir un cours débloqué */}
  <Route path="/course/:courseId" element={<CourseViewer />} />  {/* ⭐ nouveau */}

</Routes>

    </BrowserRouter>
  </React.StrictMode>
);
