// Update all users' password_hash to a known bcrypt hash for testing.
// New password for every user: mouse123
const bcrypt = require("bcryptjs");
const db = require("../src/models/connection");

(async () => {
  const hash = await bcrypt.hash("mouse123", 10);
  await db.query("UPDATE usuarios SET password = $1", [hash]);
  const { rows } = await db.query("SELECT id_usuario, correo FROM usuarios ORDER BY id_usuario");
  console.log("Usuarios actualizados:", rows);
  console.log("Nuevo hash:", hash);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
