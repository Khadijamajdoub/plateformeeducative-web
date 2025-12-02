// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyCourses from "./pages/MyCourses";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/course/:id" element={<Course />} />
          <Route
            path="/my-courses"
            element={<ProtectedRoute><MyCourses /></ProtectedRoute>}
          />
        </Routes>
      </div>
    </>
  );
}
