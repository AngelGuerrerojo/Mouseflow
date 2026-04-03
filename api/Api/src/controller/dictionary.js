const db = require("../models/connection");

async function searchDictionary(req, res) {
  const { q = "" } = req.query;
  try {
    const result = await db.query(
      `SELECT id_concepto, palabra, definicion, ejemplo_codigo
         FROM diccionario
        WHERE $1 = '' OR palabra ILIKE '%' || $1 || '%' OR definicion ILIKE '%' || $1 || '%'
     ORDER BY palabra ASC
        LIMIT 50`,
      [q]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[searchDictionary] error:", err);
    return res.status(500).json({ message: "Error al consultar diccionario" });
  }
}

module.exports = {
  searchDictionary,
};
