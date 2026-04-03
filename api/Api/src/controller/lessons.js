const db = require("../models/connection");

async function listLessons(_req, res) {
  try {
    const result = await db.query(
      "SELECT id_leccion, titulo, orden, fecha_creacion FROM lecciones ORDER BY orden ASC, id_leccion ASC"
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listLessons] error:", err);
    return res.status(500).json({ message: "Error al obtener lecciones" });
  }
}

async function getLesson(req, res) {
  const { id } = req.params;
  try {
    const lessonResult = await db.query(
      "SELECT id_leccion, titulo, contenido, orden, fecha_creacion FROM lecciones WHERE id_leccion = $1",
      [id]
    );
    if (lessonResult.rows.length === 0) return res.status(404).json({ message: "Lección no encontrada" });

    const qa = await db.query(
      `SELECT p.id_pregunta,
              p.texto_pregunta,
              r.id_respuesta,
              r.texto_respuesta,
              r.es_correcta
         FROM preguntas p
    LEFT JOIN respuestas r ON r.id_pregunta = p.id_pregunta
        WHERE p.id_leccion = $1
     ORDER BY p.id_pregunta, r.id_respuesta`,
      [id]
    );

    const preguntas = [];
    const map = new Map();
    qa.rows.forEach((row) => {
      if (!map.has(row.id_pregunta)) {
        const pregunta = {
          id_pregunta: row.id_pregunta,
          texto_pregunta: row.texto_pregunta,
          respuestas: [],
        };
        map.set(row.id_pregunta, pregunta);
        preguntas.push(pregunta);
      }
      if (row.id_respuesta) {
        map.get(row.id_pregunta).respuestas.push({
          id_respuesta: row.id_respuesta,
          texto_respuesta: row.texto_respuesta,
          es_correcta: row.es_correcta,
        });
      }
    });

    return res.json({ ...lessonResult.rows[0], preguntas });
  } catch (err) {
    console.error("[getLesson] error:", err);
    return res.status(500).json({ message: "Error al obtener la lección" });
  }
}

// Evalúa respuestas enviadas y, si todas son correctas, marca la lección como completada en progreso.
async function evaluateLesson(req, res) {
  const { id } = req.params;
  const { id_usuario, respuestas } = req.body || {};

  if (!id_usuario || !Array.isArray(respuestas) || respuestas.length === 0) {
    return res.status(400).json({ message: "id_usuario y respuestas son requeridos" });
  }

  try {
    // Respuestas correctas por pregunta para la lección
    const correctQuery = await db.query(
      `SELECT p.id_pregunta, r.id_respuesta
         FROM preguntas p
         JOIN respuestas r ON r.id_pregunta = p.id_pregunta
        WHERE p.id_leccion = $1 AND r.es_correcta = TRUE`,
      [id]
    );

    const correctMap = new Map();
    correctQuery.rows.forEach((row) => correctMap.set(row.id_pregunta, row.id_respuesta));

    const providedMap = new Map(respuestas.map((r) => [Number(r.id_pregunta), Number(r.id_respuesta)]));

    const totalPreguntas = correctMap.size;
    let correctCount = 0;
    let allAnswered = true;

    for (const [idPregunta, idRespuestaCorrecta] of correctMap.entries()) {
      const provided = providedMap.get(Number(idPregunta));
      if (!provided) {
        allAnswered = false;
        continue;
      }
      if (provided === Number(idRespuestaCorrecta)) {
        correctCount += 1;
      }
    }

    const passed = allAnswered && correctCount === totalPreguntas;

    if (passed) {
      const save = await db.query(
        `INSERT INTO progreso (id_usuario, id_leccion, completado)
             VALUES ($1, $2, TRUE)
        ON CONFLICT (id_usuario, id_leccion)
        DO UPDATE SET completado = TRUE, fecha_completado = CURRENT_TIMESTAMP
        RETURNING id_progreso, id_usuario, id_leccion, completado, fecha_completado`,
        [id_usuario, id]
      );
      return res.json({
        passed: true,
        correctCount,
        totalPreguntas,
        progreso: save.rows[0],
      });
    }

    return res.status(200).json({
      passed: false,
      correctCount,
      totalPreguntas,
      message: "Algunas respuestas son incorrectas. Revisa e inténtalo de nuevo.",
    });
  } catch (err) {
    console.error("[evaluateLesson] error:", err);
    return res.status(500).json({ message: "Error al evaluar la lección" });
  }
}

module.exports = {
  listLessons,
  getLesson,
  evaluateLesson,
};
