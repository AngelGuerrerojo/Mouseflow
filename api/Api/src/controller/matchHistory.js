const db = require("../models/connection");

async function obtener(req, res) {
    try {
        const result = await db.query("SELECT * FROM match_history ORDER BY match_date DESC, id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function obtenerPorId(req, res) {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM match_history WHERE id = $1", [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function insertar(req, res) {
    try {
        const { map_name, player_count, bone_found = false, ghost_guessed = false, players_dead = 0, match_date = new Date() } = req.body;
        const query = `INSERT INTO match_history (map_name, player_count, bone_found, ghost_guessed, players_dead, match_date)
                       VALUES ($1, $2, $3, $4, $5, $6)
                       RETURNING *`;
        const result = await db.query(query, [map_name, player_count, bone_found, ghost_guessed, players_dead, match_date]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function actualizar(req, res) {
    try {
        const { id } = req.params;
        const { map_name, player_count, bone_found = false, ghost_guessed = false, players_dead = 0, match_date = new Date() } = req.body;
        const result = await db.query(
            `UPDATE match_history
             SET map_name = $1,
                 player_count = $2,
                 bone_found = $3,
                 ghost_guessed = $4,
                 players_dead = $5,
                 match_date = $6
             WHERE id = $7
             RETURNING *`,
            [map_name, player_count, bone_found, ghost_guessed, players_dead, match_date, id]
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
        await db.query("DELETE FROM match_history WHERE id = $1", [id]);
        res.json({ deleted: true, id: Number(id) });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

module.exports = {
    obtener,
    obtenerPorId,
    insertar,
    actualizar,
    eliminar,
};
