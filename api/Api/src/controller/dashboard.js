const db = require("../models/connection");

async function getDashboard(req, res) {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM vista_dashboard_usuario WHERE id_usuario = $1",
      [userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("[getDashboard] error:", err);
    return res.status(500).json({ message: "Error al obtener dashboard" });
  }
}

async function getRanking(_req, res) {
  try {
    const result = await db.query(
      "SELECT nombre_usuario, imagen_perfil, total_logros FROM vista_ranking_usuarios ORDER BY total_logros DESC, nombre_usuario ASC"
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[getRanking] error:", err);
    return res.status(500).json({ message: "Error al obtener ranking" });
  }
}

module.exports = {
  getDashboard,
  getRanking,
};
