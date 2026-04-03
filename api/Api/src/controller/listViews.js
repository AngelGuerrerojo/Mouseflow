const db = require("../models/connection");

async function listUsuarios(_req, res) {
  try {
    const result = await db.query(
      "SELECT id_usuario, correo, fecha_registro FROM usuarios ORDER BY id_usuario ASC"
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listUsuarios] error:", err);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
}

async function listPerfiles(_req, res) {
  try {
    const result = await db.query(
      `SELECT id_perfil, id_usuario, nombre_usuario, descripcion, imagen_perfil
         FROM perfiles
     ORDER BY id_perfil ASC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listPerfiles] error:", err);
    return res.status(500).json({ message: "Error al obtener perfiles" });
  }
}

async function listLecciones(_req, res) {
  try {
    const result = await db.query(
      `SELECT id_leccion, titulo, orden, fecha_creacion
         FROM lecciones
     ORDER BY orden ASC, id_leccion ASC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listLecciones] error:", err);
    return res.status(500).json({ message: "Error al obtener lecciones" });
  }
}

async function listPreguntas(req, res) {
  const { id_leccion } = req.query;
  try {
    const params = [];
    const where = id_leccion ? ((params.push(id_leccion), "WHERE p.id_leccion = $1")) : "";

    const result = await db.query(
      `SELECT p.id_pregunta,
              p.id_leccion,
              l.titulo       AS titulo_leccion,
              p.texto_pregunta
         FROM preguntas p
         JOIN lecciones l ON l.id_leccion = p.id_leccion
              ${where}
     ORDER BY p.id_pregunta ASC`,
      params
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listPreguntas] error:", err);
    return res.status(500).json({ message: "Error al obtener preguntas" });
  }
}

async function listRespuestas(req, res) {
  const { id_pregunta } = req.query;
  try {
    const params = [];
    const where = id_pregunta ? ((params.push(id_pregunta), "WHERE r.id_pregunta = $1")) : "";

    const result = await db.query(
      `SELECT r.id_respuesta,
              r.id_pregunta,
              p.texto_pregunta,
              r.texto_respuesta,
              r.es_correcta
         FROM respuestas r
         JOIN preguntas p ON p.id_pregunta = r.id_pregunta
              ${where}
     ORDER BY r.id_respuesta ASC`,
      params
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listRespuestas] error:", err);
    return res.status(500).json({ message: "Error al obtener respuestas" });
  }
}

async function listProgreso(req, res) {
  const { id_usuario } = req.query;
  try {
    const params = [];
    const where = id_usuario ? ((params.push(id_usuario), "WHERE pr.id_usuario = $1")) : "";

    const result = await db.query(
      `SELECT pr.id_progreso,
              pr.id_usuario,
              u.correo,
              pr.id_leccion,
              l.titulo,
              pr.completado,
              pr.fecha_completado
         FROM progreso pr
         JOIN usuarios u ON u.id_usuario = pr.id_usuario
         JOIN lecciones l ON l.id_leccion = pr.id_leccion
              ${where}
     ORDER BY pr.id_progreso ASC`,
      params
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listProgreso] error:", err);
    return res.status(500).json({ message: "Error al obtener progreso" });
  }
}

async function listLogros(_req, res) {
  try {
    const result = await db.query(
      `SELECT id_logro, nombre, descripcion, icono_url
         FROM logros
     ORDER BY id_logro ASC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listLogros] error:", err);
    return res.status(500).json({ message: "Error al obtener logros" });
  }
}

async function listLogrosUsuarios(req, res) {
  const { id_usuario } = req.query;
  try {
    const params = [];
    const where = id_usuario ? ((params.push(id_usuario), "WHERE lu.id_usuario = $1")) : "";

    const result = await db.query(
      `SELECT lu.id_usuario,
              p.nombre_usuario,
              lu.id_logro,
              l.nombre      AS logro,
              lu.fecha_obtenido
         FROM logros_usuarios lu
         JOIN perfiles p ON p.id_usuario = lu.id_usuario
         JOIN logros l ON l.id_logro = lu.id_logro
              ${where}
     ORDER BY lu.fecha_obtenido DESC`,
      params
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listLogrosUsuarios] error:", err);
    return res.status(500).json({ message: "Error al obtener logros de usuarios" });
  }
}

async function listDiccionario(_req, res) {
  try {
    const result = await db.query(
      `SELECT id_concepto, palabra, definicion, ejemplo_codigo
         FROM diccionario
     ORDER BY palabra ASC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listDiccionario] error:", err);
    return res.status(500).json({ message: "Error al obtener diccionario" });
  }
}

async function listVistaDashboard(_req, res) {
  try {
    const result = await db.query(
      `SELECT *
         FROM vista_dashboard_usuario
     ORDER BY id_usuario ASC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listVistaDashboard] error:", err);
    return res.status(500).json({ message: "Error al obtener vista de dashboard" });
  }
}

async function listVistaRanking(_req, res) {
  try {
    const result = await db.query(
      `SELECT *
         FROM vista_ranking_usuarios
     ORDER BY total_logros DESC, nombre_usuario ASC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[listVistaRanking] error:", err);
    return res.status(500).json({ message: "Error al obtener vista de ranking" });
  }
}

module.exports = {
  listUsuarios,
  listPerfiles,
  listLecciones,
  listPreguntas,
  listRespuestas,
  listProgreso,
  listLogros,
  listLogrosUsuarios,
  listDiccionario,
  listVistaDashboard,
  listVistaRanking,
};
