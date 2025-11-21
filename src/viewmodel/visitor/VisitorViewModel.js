// src/viewmodel/visitor/VisitorViewModel.js
import { useState } from "react";

/**
 * ViewModel pour le module Visiteur (Ons)
 * Elle pourra ici :
 *  - charger les clubs publics
 *  - rechercher des clubs
 *  - lire les événements publics
 */
export function useVisitorViewModel() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger tous les clubs publics
  const fetchPublicClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: VisitorRepository.getPublicClubs()
      console.log("TODO: implémenter fetchPublicClubs dans VisitorViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des clubs publics");
    } finally {
      setLoading(false);
    }
  };

  // Rechercher des clubs (par nom, catégorie...)
  const searchClubs = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: VisitorRepository.searchClubs(query)
      console.log("TODO: implémenter searchClubs dans VisitorViewModel", query);
      // setSearchResults(result);
    } catch (e) {
      setError(e.message || "Erreur lors de la recherche de clubs");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: VisitorRepository.getPublicEvents()
      console.log("TODO: implémenter fetchEvents dans VisitorViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des événements");
    } finally {
      setLoading(false);
    }
  };

  return {
    clubs,
    events,
    searchResults,
    loading,
    error,
    fetchPublicClubs,
    searchClubs,
    fetchEvents,
  };
}
