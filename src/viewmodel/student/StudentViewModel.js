// src/viewmodel/student/StudentViewModel.js
import { useState } from "react";

/**
 * ViewModel pour le module Étudiant (Islem)
 * Ici il pourra :
 *  - charger la liste des clubs
 *  - charger les événements
 *  - envoyer une candidature à un club
 *  - uploader un CV
 *  - modifier le profil étudiant
 */
export function useStudentViewModel() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Exemple de méthode TODO pour Islem :
  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: appeler StudentRepository.getClubs()
      console.log("TODO: implémenter fetchClubs dans StudentViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des clubs");
    } finally {
      setLoading(false);
    }
  };

  const applyToClub = async (applicationData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: StudentRepository.applyToClub(applicationData)
      console.log("TODO: implémenter applyToClub dans StudentViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors de la candidature");
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
    clubs,
    events,
    applications,
    loading,
    error,
    fetchClubs,
    fetchEvents,
    applyToClub,
  };
}
