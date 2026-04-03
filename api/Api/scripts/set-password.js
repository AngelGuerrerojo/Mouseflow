/**
 * Establece una contraseña (con bcrypt) para un usuario específico.
 * Uso:
 *   node scripts/set-password.js correo@example.com NuevaContraseña
 */
const bcrypt = require("bcryptjs");
const db = require("../src/models/connection");

const [, , correoArg, passwordArg] = process.argv;

if (!correoArg || !passwordArg) {
  console.error("Uso: node scripts/set-password.js correo@example.com NuevaContraseña");
  process.exit(1);
}

(async () => {
  const correo = correoArg.trim().toLowerCase();
  const hash = await bcrypt.hash(passwordArg, 10);
  const result = await db.query(
    "UPDATE usuarios SET password = $1 WHERE correo = $2 RETURNING id_usuario, correo",
    [hash, correo]
  );
  if (result.rowCount === 0) {
    console.error(`No se encontró el usuario con correo ${correo}`);
    process.exit(1);
  }
  console.log(`Contraseña actualizada para ${correo}`);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
