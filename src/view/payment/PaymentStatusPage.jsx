import { useSearchParams, useNavigate } from "react-router-dom";
import CourseUnlockRepository from "../../services/CourseUnlockRepository";

export default function PaymentStatusPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status = params.get("status");         // success | failed
  const courseId = params.get("courseId");     // ex: course1
  const userId = "demo-user";                  // TODO: remplacer plus tard

  // Débloquer le cours si succès
  if (status === "success" && courseId) {
    CourseUnlockRepository.unlockCourse(userId, courseId);
  }

  return (
    <div style={{ padding: "50px" }}>
      <h1>Statut du paiement</h1>

      {status === "success" ? (
        <>
          <p style={{ color: "#4CAF50", fontSize: "20px" }}>Paiement réussi ! 🎉</p>

          <button
            onClick={() => navigate("/my-courses")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "green",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Voir mon cours débloqué
          </button>
        </>
      ) : (
        <>
          <p style={{ color: "red", fontSize: "20px" }}>Paiement échoué ❌</p>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "red",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </>
      )}
    </div>
  );
}
