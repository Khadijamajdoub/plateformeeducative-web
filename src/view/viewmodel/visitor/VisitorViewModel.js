// src/viewmodel/visitor/VisitorViewModel.js
import { useState } from "react";

/**
 * ViewModel pour le module Visiteur (Ons)
 * Basé sur les COURS publics.
 */
export function useVisitorViewModel() {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("TODO: implémenter fetchPublicCourses dans VisitorViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  const searchCourses = async (query) => {
    setLoading(true);
    setError(null);
    try {
      console.log("TODO: implémenter searchCourses dans VisitorViewModel", query);
      // setSearchResults(result);
    } catch (e) {
      setError(e.message || "Erreur lors de la recherche de cours");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("TODO: implémenter fetchEvents dans VisitorViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des événements");
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    events,
    searchResults,
    loading,
    error,
    fetchPublicCourses,
    searchCourses,
    fetchEvents,
  };
}
