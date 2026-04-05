import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getCurrentUser, lessonApi, progressApi } from "../lib/api";

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [qaState, setQaState] = useState({});
  const [resultMsg, setResultMsg] = useState("");

  const isCompleted = progress?.completado === true;

  useEffect(() => {
    async function load() {
      if (!user?.id_usuario || !id) return;
      setLoading(true);
      setError("");
      try {
        const [lessonResp, progressResp] = await Promise.all([
          lessonApi.detail(id),
          progressApi.list(user.id_usuario),
        ]);
        setLesson(lessonResp);
        const found = progressResp.find((p) => String(p.id_leccion) === String(id));
        setProgress(found || null);
      } catch (err) {
        setError(err.message || "Error al cargar la lección");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user?.id_usuario]);

  const answeredAll = useMemo(() => {
    if (!lesson?.preguntas) return false;
    return lesson.preguntas.every((q) => qaState[q.id_pregunta]);
  }, [lesson, qaState]);

  const handleAnswer = (idPregunta, idRespuesta) => {
    setQaState((prev) => ({ ...prev, [idPregunta]: idRespuesta }));
  };

  const handleEvaluate = async () => {
    if (!user?.id_usuario || !lesson?.id_leccion) return;
    setSaving(true);
    setError("");
    setResultMsg("");
      try {
        const payload = {
          id_usuario: user.id_usuario,
          respuestas: Object.entries(qaState).map(([id_pregunta, id_respuesta]) => ({
            id_pregunta: Number(id_pregunta),
            id_respuesta: Number(id_respuesta),
          })),
        };
        const resp = await lessonApi.evaluate(lesson.id_leccion, payload);
        if (resp.passed) {
          setProgress(resp.progreso || { completado: true });
          setResultMsg("¡Correcto! Progreso guardado.");
        } else {
          setResultMsg(resp.message || "Hay respuestas incorrectas.");
          navigate("/menu", { replace: true });
        }
      } catch (err) {
        setError(err.message || "No se pudo guardar el progreso");
      } finally {
        setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <p className="text-secondary">Inicia sesión para ver esta lección.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p className="text-secondary">Cargando lección...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container py-5">
        <p className="text-secondary">Lección no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container py-5 lesson-shell">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Lección {lesson.orden}</p>
          <h2 className="fw-bold text-primary mb-1">{lesson.titulo}</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <div
            className="lesson-content"
            dangerouslySetInnerHTML={{ __html: lesson.contenido || "" }}
          />
        </div>
      </div>

      {lesson.preguntas && lesson.preguntas.length > 0 && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white border-bottom">
            <h5 className="fw-bold text-dark mb-0">Preguntas de repaso</h5>
          </div>
          <div className="card-body">
            {lesson.preguntas.map((q) => {
              const selected = qaState[q.id_pregunta];

              const onDragStart = (e, ansId) => {
                e.dataTransfer.setData("text/plain", JSON.stringify({ q: q.id_pregunta, a: ansId }));
              };

              const onDrop = (e) => {
                e.preventDefault();
                try {
                  const data = JSON.parse(e.dataTransfer.getData("text/plain"));
                  if (data.q === q.id_pregunta) {
                    handleAnswer(q.id_pregunta, data.a);
                  }
                } catch (err) {
                  /* ignore */
                }
              };

              const onDragOver = (e) => e.preventDefault();

              return (
                <div key={q.id_pregunta} className="mb-4">
                  <p className="fw-semibold mb-2">{q.texto_pregunta}</p>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {q.respuestas?.map((r) => (
                      <div
                        key={r.id_respuesta}
                        draggable
                        onDragStart={(e) => onDragStart(e, r.id_respuesta)}
                        onClick={() => handleAnswer(q.id_pregunta, r.id_respuesta)}
                        className={`badge rounded-pill px-3 py-2 cursor-pointer lesson-answer-pill ${
                          selected === r.id_respuesta ? "bg-primary text-white" : "bg-light text-dark border"
                        }`}
                        style={{ userSelect: "none" }}
                      >
                        {r.texto_respuesta}
                      </div>
                    ))}
                  </div>

                  <div
                    className={`p-3 rounded-3 border border-dashed ${
                      selected ? "border-success bg-success bg-opacity-10" : "border-secondary bg-light"
                    }`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                  >
                    {selected
                      ? `Respuesta seleccionada: ${
                          q.respuestas.find((r) => r.id_respuesta === selected)?.texto_respuesta ?? ""
                        }`
                      : "Arrastra y suelta una respuesta aquí (o haz click en una opción)."}
                  </div>
                </div>
              );
            })}

            <div className="d-flex align-items-start align-items-md-center gap-3 flex-column flex-md-row lesson-evaluate-actions">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleEvaluate}
                disabled={saving || isCompleted || !answeredAll}
              >
                {isCompleted ? "Completada" : saving ? "Guardando..." : "Marcar como completada"}
              </button>
              {!answeredAll && <span className="text-muted small">Responde todas las preguntas para marcar completada.</span>}
              {resultMsg && <span className="text-secondary small">{resultMsg}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
