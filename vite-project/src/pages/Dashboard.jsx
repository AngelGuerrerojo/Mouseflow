import { useEffect, useMemo, useState } from "react";
import { dashboardApi, getCurrentUser, lessonApi, progressApi, dictionaryApi } from "../lib/api";
import { Link } from "react-router";

export default function Dashboard() {
  const user = getCurrentUser();
  const [stats, setStats] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [dictionary, setDictionary] = useState([]);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLessons, setShowLessons] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  const extraVideos = [
    { title: "Contenido extra 1", videoId: "5EqYLM2eoGM" },
    { title: "Contenido extra 2", videoId: "LXb3EKWsInQ" },
    { title: "Contenido extra 3", videoId: "9bZkp7q19f0" },
  ];

  useEffect(() => {
    async function load() {
      if (!user?.id_usuario) return;
      setLoading(true);
      setError("");
      try {
        const [statsResp, lessonsResp, progressResp] = await Promise.all([
          dashboardApi.stats(user.id_usuario),
          lessonApi.list(),
          progressApi.list(user.id_usuario),
        ]);
        setStats(statsResp);
        setLessons(lessonsResp);
        setProgress(progressResp);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id_usuario]);

  async function loadDictionaryOnce() {
    if (dictionary.length > 0 || dictLoading) return;
    try {
      setDictLoading(true);
      setDictError("");
      const items = await dictionaryApi.search("");
      setDictionary(items);
    } catch (err) {
      setDictError(err.message || "Error al cargar diccionario");
    } finally {
      setDictLoading(false);
    }
  }

  const lessonsWithProgress = useMemo(() => {
    const map = new Map(progress.map((p) => [p.id_leccion, p]));
    return lessons.map((l) => {
      const p = map.get(l.id_leccion);
      return {
        ...l,
        completado: p?.completado ?? false,
        fecha_completado: p?.fecha_completado ?? null,
      };
    });
  }, [lessons, progress]);

  if (!user) {
    return (
      <div className="container py-5">
        <p className="text-secondary">Inicia sesión para ver tu tablero.</p>
      </div>
    );
  }

  return (
    <div className="container py-5 dashboard-shell">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-5 mt-4 border-bottom pb-3">
        <div className="mb-3 mb-md-0">
          <h2 className="fw-bold text-primary mb-1">¡Hola, {stats?.nombre_usuario || user.correo}!</h2>
          <p className="text-secondary mb-0">Repasa tu avance y continúa con la siguiente lección.</p>
        </div>
        <div className="text-md-end">
          <span className="badge bg-secondary text-dark rounded-pill px-3 py-2 fs-6 shadow-sm">
            <i className="bi bi-lightning-fill me-1" /> {stats?.lecciones_completadas ?? 0} lecciones completadas
          </span>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-primary rounded-circle p-3">
                <i className="bi bi-journal-code text-white" />
              </span>
              <div>
                <p className="text-secondary mb-1">Lecciones completadas</p>
                <h4 className="fw-bold text-primary mb-0">{stats?.lecciones_completadas ?? 0}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-dark rounded-circle p-3">
                <i className="bi bi-award-fill text-white" />
              </span>
              <div>
                <p className="text-secondary mb-1">Logros obtenidos</p>
                <h4 className="fw-bold text-dark mb-0">{stats?.total_logros ?? 0}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-secondary text-dark rounded-circle p-3">
                <i className="bi bi-stars" />
              </span>
              <div>
                <p className="text-secondary mb-1">Último logro</p>
                <h6 className="fw-bold text-dark mb-0">{stats?.ultimo_logro || "Aún sin logros"}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center text-center gap-3 mb-4">
        <h4 className="fw-bold text-dark mb-0">Explora</h4>
        <div className="d-flex flex-wrap justify-content-center gap-2 dashboard-explore-actions">
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
            onClick={() => setShowLessons((v) => !v)}
          >
            {showLessons ? "Ocultar lecciones" : "Lecciones"}
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
            onClick={() => {
              const next = !showDictionary;
              setShowDictionary(next);
              if (next) loadDictionaryOnce();
            }}
          >
            {showDictionary ? "Ocultar diccionario" : "Diccionario"}
          </button>
          <button
            type="button"
            className="btn btn-secondary rounded-pill px-4 py-2 fw-semibold"
            onClick={() => setShowExtra((v) => !v)}
          >
            {showExtra ? "Ocultar contenido extra" : "Contenido extra"}
          </button>
        </div>
      </div>
      {showLessons && (
        <>
          {loading ? (
            <p className="text-secondary">Cargando contenido...</p>
          ) : (
            <div className="row g-3 mb-5">
              {lessonsWithProgress.map((lesson) => (
                <div className="col-md-6 col-lg-4" key={lesson.id_leccion}>
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge bg-primary bg-opacity-10 text-primary">Lección {lesson.orden}</span>
                      {lesson.completado && (
                        <span className="badge bg-success text-white d-inline-flex align-items-center gap-1">
                          <i className="bi bi-check-circle" /> Completada
                        </span>
                      )}
                    </div>
                    <h5 className="fw-bold text-dark">{lesson.titulo}</h5>
                    <p className="text-muted small mb-3">
                      {lesson.completado
                        ? "¡Bien hecho! Puedes repasar el contenido o avanzar a la siguiente lección."
                        : "Pendiente por completar."}
                    </p>
                    <Link
                      to={`/lecciones/${lesson.id_leccion}`}
                      className="btn btn-outline-primary rounded-pill w-100 fw-semibold"
                    >
                      Abrir lección
                    </Link>
                  </div>
                </div>
              ))}
              {lessonsWithProgress.length === 0 && <p className="text-secondary">Aún no hay lecciones cargadas.</p>}
            </div>
          )}
        </>
      )}

      {showDictionary && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <div className="card-header bg-white border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
            <h5 className="fw-bold text-dark mb-0">Diccionario</h5>
            {dictLoading && <span className="text-muted small">Cargando...</span>}
          </div>
          <div className="list-group list-group-flush">
            {dictError && <div className="list-group-item text-danger">{dictError}</div>}
            {!dictLoading && dictionary.length === 0 && !dictError && (
              <div className="list-group-item text-secondary">Sin entradas de diccionario.</div>
            )}
            {dictionary.map((item) => (
              <div key={item.id_concepto} className="list-group-item">
                <div className="fw-bold text-dark">{item.palabra}</div>
                <div className="text-muted small">{item.definicion}</div>
                {item.ejemplo_codigo && (
                  <pre className="bg-light border rounded p-2 mt-2 mb-0 small text-secondary dashboard-code-block">
                    {item.ejemplo_codigo}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showExtra && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <div className="card-header bg-white border-bottom">
            <h5 className="fw-bold text-dark mb-0">Contenido extra</h5>
            <p className="text-secondary mb-0 small">Videos recomendados desde YouTube.</p>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {extraVideos.map((vid) => (
                <div className="col-md-4" key={vid.videoId}>
                  <div className="ratio ratio-16x9 rounded overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${vid.videoId}`}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="fw-semibold text-dark mt-2 mb-0">{vid.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
