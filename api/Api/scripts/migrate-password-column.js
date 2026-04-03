// Añade la columna password si no existe, y copia los datos desde password_hash.
const db = require("../src/models/connection");

(async () => {
  try {
    await db.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT ''`);
    await db.query(`UPDATE usuarios SET password = password_hash WHERE (password IS NULL OR password = '') AND password_hash IS NOT NULL`);
    await db.query(`ALTER TABLE usuarios DROP COLUMN IF EXISTS password_hash`);
    console.log("Migración completada: columna password lista y password_hash eliminada.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
