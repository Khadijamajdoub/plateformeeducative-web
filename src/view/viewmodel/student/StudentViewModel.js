// src/viewmodel/student/StudentViewModel.js
import { useState } from "react";

/**
 * ViewModel pour le module Étudiant (Islem)
 * Maintenant basé sur des COURS (courses) et non des clubs.
 */
export function useStudentViewModel() {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: StudentRepository.getCourses()
      console.log("TODO: implémenter fetchCourses dans StudentViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  const applyToCourse = async (applicationData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: StudentRepository.applyToCourse(applicationData)
      console.log("TODO: implémenter applyToCourse dans StudentViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors de la candidature au cours");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("TODO: implémenter fetchEvents dans StudentViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des événements");
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    events,
    applications,
    loading,
    error,
    fetchCourses,
    fetchEvents,
    applyToCourse,
  };
}
