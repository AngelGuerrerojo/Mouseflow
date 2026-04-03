const db = require("../models/connection");

async function obtener(req, res) {
    try {
        const result = await db.query("SELECT id, username, created_at FROM users ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function saludo(req, res) {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT id, username, created_at FROM users WHERE id = $1", [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function insertar(req, res) {
    try {
        const { username, password } = req.body;
        const query = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at";
        const result = await db.query(query, [username, password]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function actualizar(req, res) {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        const result = await db.query(
            "UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING id, username, created_at",
            [username, password, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function actualizarcol(req, res) {
    try {
        const { id } = req.params;
        const { username } = req.body;
        const result = await db.query(
            "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, created_at",
            [username, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function eliminar(req, res) {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM users WHERE id = $1", [id]);
        res.json({ deleted: true, id: Number(id) });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

module.exports = {
    obtener,
    saludo,
    insertar,
    actualizar,
    actualizarcol,
    eliminar
}
