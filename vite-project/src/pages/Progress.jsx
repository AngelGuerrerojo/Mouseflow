import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getCurrentUser, lessonApi, progressApi } from "../lib/api";

export default function Progress() {
  const user = getCurrentUser();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user?.id_usuario) return;
      setLoading(true);
      setError("");
      try {
        const [lessonResp, progressResp, achievementsResp] = await Promise.all([
          lessonApi.list(),
          progressApi.list(user.id_usuario),
          progressApi.achievements(user.id_usuario),
        ]);
        setLessons(lessonResp);
        setProgress(progressResp);
        setAchievements(achievementsResp);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id_usuario]);

  const completedCount = useMemo(() => progress.filter((p) => p.completado).length, [progress]);
  const completionPct = useMemo(() => {
    if (lessons.length === 0) return 0;
    return Math.round((completedCount / lessons.length) * 100);
  }, [completedCount, lessons.length]);

  if (!user) {
    return (
      <div className="container py-5">
        <p className="text-secondary">Inicia sesión para ver tu progreso.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mt-4 mb-5">
        <h2 className="fw-bold text-primary mb-1">Tu Progreso General</h2>
        <p className="text-secondary">Seguimiento en tiempo real de tus lecciones y logros.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row text-center gy-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary bg-opacity-10 h-100 justify-content-center">
            <div className="display-4 fw-bold text-primary mb-2">{completedCount}</div>
            <div className="text-secondary-emphasis fw-medium">Lecciones Completadas</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-secondary bg-opacity-10 h-100 justify-content-center">
            <div className="display-4 fw-bold text-secondary text-on-yellow mb-2">
              {completionPct}%
            </div>
            <div className="text-secondary-emphasis fw-medium">Avance Total</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark bg-opacity-10 h-100 justify-content-center">
            <div className="display-4 fw-bold text-dark mb-2">{achievements.length}</div>
            <div className="text-secondary-emphasis fw-medium">Logros</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white border-bottom p-4">
          <h4 className="fw-bold text-dark mb-0">Estado por Lección</h4>
        </div>
        {loading ? (
          <div className="p-4 text-secondary">Cargando...</div>
        ) : (
          <div className="list-group list-group-flush">
            {lessons.map((lesson, idx) => {
              const prog = progress.find((p) => p.id_leccion === lesson.id_leccion);
              const done = prog?.completado;
              return (
                <div
                  key={lesson.id_leccion}
                  className={`list-group-item d-flex align-items-center p-4 ${idx === 0 ? "border-0" : "border-top"}`}
                >
                  <div className="me-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary">#{lesson.orden}</span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold text-dark">{lesson.titulo}</h6>
                    <p className="text-muted small mb-0">
                      {done ? "Completada" : "Pendiente"} {prog?.fecha_completado ? `· ${new Date(prog.fecha_completado).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="me-3">
                    <Link to={`/lecciones/${lesson.id_leccion}`} className="btn btn-sm btn-outline-primary rounded-pill">
                      Abrir
                    </Link>
                  </div>
                  {done ? (
                    <span className="badge bg-success d-flex align-items-center gap-1">
                      <i className="bi bi-check2-circle" /> Hecho
                    </span>
                  ) : (
                    <span className="badge bg-light text-secondary">En curso</span>
                  )}
                </div>
              );
            })}
            {lessons.length === 0 && <div className="list-group-item text-secondary">No hay lecciones registradas.</div>}
          </div>
        )}
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="card-header bg-white border-bottom p-4 d-flex align-items-center justify-content-between">
          <h4 className="fw-bold text-dark mb-0">Logros Desbloqueados</h4>
          <span className="badge bg-secondary text-dark">{achievements.length}</span>
        </div>
        <div className="list-group list-group-flush">
          {achievements.map((item, idx) => (
            <div
              key={item.id_logro}
              className={`list-group-item d-flex align-items-center p-4 ${idx === 0 ? "border-0" : "border-top"}`}
            >
              <div className="bg-secondary bg-opacity-25 rounded-circle p-3 me-4 text-secondary text-on-yellow shadow-sm">
                <i className="bi bi-award-fill fs-4" />
              </div>
              <div>
                <h5 className="mb-1 fw-bold text-dark">{item.nombre}</h5>
                <p className="text-muted mb-0">{item.descripcion}</p>
              </div>
              <span className="ms-auto badge bg-light text-secondary border px-3 py-2">
                {new Date(item.fecha_obtenido).toLocaleDateString()}
              </span>
            </div>
          ))}
          {achievements.length === 0 && <div className="list-group-item text-secondary">Todavía no tienes logros. ¡Completa tu primera lección!</div>}
        </div>
      </div>
    </div>
  );
}
