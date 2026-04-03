import { useEffect, useState } from "react";
import { dashboardApi, getCurrentUser } from "../lib/api";

export default function Ranking() {
  const user = getCurrentUser();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await dashboardApi.ranking();
        setRanking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!user) {
    return (
      <div className="container py-5">
        <p className="text-secondary">Inicia sesión para ver el ranking.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 mt-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">Ranking de usuarios</h2>
          <p className="text-secondary mb-0">Clasificación por cantidad de logros obtenidos.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-secondary">Cargando ranking...</p>}

      {!loading && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="list-group list-group-flush">
            {ranking.map((item, idx) => (
              <div key={item.nombre_usuario + idx} className="list-group-item d-flex align-items-center p-3">
                <span className="badge bg-secondary text-dark me-3">{idx + 1}</span>
                <div>
                  <div className="fw-bold text-dark">{item.nombre_usuario}</div>
                  <div className="text-muted small">{item.total_logros} logros</div>
                </div>
              </div>
            ))}
            {ranking.length === 0 && <div className="list-group-item text-secondary">Sin datos de ranking aún.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
