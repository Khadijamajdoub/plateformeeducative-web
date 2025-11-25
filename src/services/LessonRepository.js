// 🚀 Fichier temporaire pour ne pas avoir d'erreurs
// Sana remplacera ce fichier par sa vraie version plus tard

export default class LessonRepository {
  static async getLessons(courseId) {
    return [
      {
        id: "lesson1",
        title: "Introduction (fake)",
        type: "text",
        content: "Ceci est une leçon de test.",
      },
      {
        id: "lesson2",
        title: "Chapitre 1 (fake)",
        type: "text",
        content: "Contenu du chapitre 1.",
      },
    ];
  }
}
