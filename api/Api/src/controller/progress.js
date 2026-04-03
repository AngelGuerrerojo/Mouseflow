const db = require("../models/connection");

async function getProgress(req, res) {
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT pr.id_leccion,
              pr.completado,
              pr.fecha_completado,
              l.titulo,
              l.orden
         FROM progreso pr
         JOIN lecciones l ON l.id_leccion = pr.id_leccion
        WHERE pr.id_usuario = $1
     ORDER BY l.orden ASC`,
      [userId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[getProgress] error:", err);
    return res.status(500).json({ message: "Error al obtener progreso" });
  }
}

async function upsertProgress(req, res) {
  const { id_usuario, id_leccion, completado = true } = req.body;
  if (!id_usuario || !id_leccion) {
    return res.status(400).json({ message: "id_usuario e id_leccion son requeridos" });
  }

  try {
    const result = await db.query(
      `INSERT INTO progreso (id_usuario, id_leccion, completado)
           VALUES ($1, $2, $3)
      ON CONFLICT (id_usuario, id_leccion)
      DO UPDATE SET completado = EXCLUDED.completado, fecha_completado = CURRENT_TIMESTAMP
      RETURNING id_progreso, id_usuario, id_leccion, completado, fecha_completado`,
      [id_usuario, id_leccion, completado]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("[upsertProgress] error:", err);
    return res.status(500).json({ message: "Error al guardar progreso" });
  }
}

async function listAchievements(req, res) {
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT lu.id_logro,
              l.nombre,
              l.descripcion,
              l.icono_url,
              lu.fecha_obtenido
         FROM logros_usuarios lu
         JOIN logros l ON l.id_logro = lu.id_logro
        WHERE lu.id_usuario = $1
     ORDER BY lu.fecha_obtenido DESC`,
      [userId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listAchievements] error:", err);
    return res.status(500).json({ message: "Error al obtener logros" });
  }
}

module.exports = {
  getProgress,
  upsertProgress,
  listAchievements,
};
