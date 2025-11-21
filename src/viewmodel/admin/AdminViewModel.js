// src/viewmodel/admin/AdminViewModel.js
import { useState } from "react";

/**
 * ViewModel pour le module Admin (Sana)
 * Ici, elle pourra :
 *  - charger la liste des utilisateurs
 *  - charger la liste des cours
 *  - voir les stats (ventes, inscrits, etc.)
 *  - gérer les promotions / abonnements
 */
export function useAdminViewModel() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Exemple de méthode à implémenter plus tard par Sana
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: appeler un futur AdminRepository.getAllUsers()
      // const data = await AdminRepository.getAllUsers();
      // setUsers(data);
      console.log("TODO: implémenter fetchUsers dans AdminViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: appel futur AdminRepository.getAllCourses()
      console.log("TODO: implémenter fetchCourses dans AdminViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: appel futur AdminRepository.getStats()
      console.log("TODO: implémenter fetchStats dans AdminViewModel");
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des stats");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    courses,
    stats,
    loading,
    error,
    fetchUsers,
    fetchCourses,
    fetchStats,
  };
}
