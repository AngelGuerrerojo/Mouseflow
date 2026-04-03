const bcrypt = require("bcryptjs");
const db = require("../models/connection");

async function register(req, res) {
  try {
    const correoRaw = req.body.correo;
    const password = req.body.password;
    const correo = correoRaw?.trim().toLowerCase();
    if (!correo || !password) {
      return res.status(400).json({ message: "correo y password son requeridos" });
    }

    const existing = await db.query("SELECT id_usuario FROM usuarios WHERE correo = $1", [correo]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await db.query(
      "INSERT INTO usuarios (correo, password) VALUES ($1, $2) RETURNING id_usuario, correo, fecha_registro",
      [correo, passwordHash]
    );

    const user = inserted.rows[0];
    // El trigger crea el perfil automáticamente; lo consultamos para retornarlo.
    const perfil = await db.query(
      "SELECT id_perfil, nombre_usuario, descripcion, imagen_perfil FROM perfiles WHERE id_usuario = $1",
      [user.id_usuario]
    );

    return res.status(201).json({ user, perfil: perfil.rows[0] });
  } catch (err) {
    console.error("[register] error:", err);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
}

async function login(req, res) {
  try {
    const correoRaw = req.body.correo;
    const password = req.body.password;
    const correo = correoRaw?.trim().toLowerCase();
    if (!correo || !password) {
      return res.status(400).json({ message: "correo y password son requeridos" });
    }

    const result = await db.query("SELECT id_usuario, correo, password FROM usuarios WHERE correo = $1", [correo]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordHash = user.password || "";

    // Permite tanto contraseñas con hash bcrypt como valores plano (datos semilla antiguos).
    let match = false;
    if (passwordHash.startsWith("$2a$") || passwordHash.startsWith("$2b$") || passwordHash.startsWith("$2y$")) {
      match = await bcrypt.compare(password, passwordHash);
    } else {
      match = password === passwordHash;
    }

    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const perfil = await db.query(
      "SELECT id_perfil, nombre_usuario, descripcion, imagen_perfil FROM perfiles WHERE id_usuario = $1",
      [user.id_usuario]
    );

    return res.json({
      user: {
        id_usuario: user.id_usuario,
        correo: user.correo,
      },
      perfil: perfil.rows[0] || null,
    });
  } catch (err) {
    console.error("[login] error:", err);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

async function getProfile(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT p.id_perfil, p.nombre_usuario, p.descripcion, p.imagen_perfil,
              u.id_usuario, u.correo, u.fecha_registro
         FROM perfiles p
         JOIN usuarios u ON u.id_usuario = p.id_usuario
        WHERE p.id_usuario = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Perfil no encontrado" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("[getProfile] error:", err);
    return res.status(500).json({ message: "Error al obtener el perfil" });
  }
}

async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    const { nombre_usuario, descripcion, imagen_perfil } = req.body;

    const result = await db.query(
      `UPDATE perfiles
          SET nombre_usuario = COALESCE($2, nombre_usuario),
              descripcion    = COALESCE($3, descripcion),
              imagen_perfil  = COALESCE($4, imagen_perfil)
        WHERE id_usuario = $1
      RETURNING id_perfil, nombre_usuario, descripcion, imagen_perfil`,
      [id, nombre_usuario, descripcion, imagen_perfil]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Perfil no encontrado" });

    return res.json(result.rows[0]);
  } catch (err) {
    // Manejar error de unicidad en nombre_usuario
    if (err.code === "23505") {
      return res.status(409).json({ message: "Ese nombre de usuario ya está en uso" });
    }
    console.error("[updateProfile] error:", err);
    return res.status(500).json({ message: "Error al actualizar el perfil" });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
