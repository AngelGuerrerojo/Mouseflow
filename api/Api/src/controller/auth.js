const db = require("../models/connection");

// Login: solo permite iniciar sesión si el usuario existe en la tabla `users`
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username y password son requeridos" });
    }

    const result = await db.query("SELECT id, username, password FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.json({ ok: true, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

module.exports = { login };
