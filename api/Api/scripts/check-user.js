const bcrypt = require("bcryptjs");
const db = require("../src/models/connection");

const correo = "ana.lopez@email.com";
const password = "mouse123";

(async () => {
const { rows } = await db.query("SELECT id_usuario, correo, password FROM usuarios WHERE correo = $1", [correo]);
  console.log("User row:", rows[0]);
  if (!rows[0]) return process.exit(0);
  const hash = rows[0].password || "";
  const ok = await bcrypt.compare(password, hash);
  console.log(`Compare "${password}" ->`, ok);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
