const db = require("../models/connection");

async function obtener(req, res) {
    try {
        const result = await db.query("SELECT * FROM items ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function obtenerPorId(req, res) {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function insertar(req, res) {
    try {
        const {
            name,
            tier,
            cost,
            max_amount,
            is_electronic = false,
            is_consumable = false,
            description = "",
        } = req.body;

        const query = `INSERT INTO items (name, tier, cost, max_amount, is_electronic, is_consumable, description)
                       VALUES ($1, $2, $3, $4, $5, $6, $7)
                       RETURNING *`;
        const result = await db.query(query, [
            name,
            tier,
            cost,
            max_amount,
            is_electronic,
            is_consumable,
            description,
        ]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function actualizar(req, res) {
    try {
        const { id } = req.params;
        const {
            name,
            tier,
            cost,
            max_amount,
            is_electronic = false,
            is_consumable = false,
            description = "",
        } = req.body;

        const result = await db.query(
            `UPDATE items
             SET name = $1,
                 tier = $2,
                 cost = $3,
                 max_amount = $4,
                 is_electronic = $5,
                 is_consumable = $6,
                 description = $7
             WHERE id = $8
             RETURNING *`,
            [name, tier, cost, max_amount, is_electronic, is_consumable, description, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}

async function actualizarPrecio(req, res) {
    try {
        const { id } = req.params;
        const { cost } = req.body;
        const result = await db.query(
            "UPDATE items SET cost = $1 WHERE id = $2 RETURNING *",
            [cost, id]
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
        await db.query("DELETE FROM items WHERE id = $1", [id]);
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
    actualizarPrecio,
    eliminar
}
