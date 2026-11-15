const pool = require('../config/db');

// Obtener todas las peticiones para el panel admin (con alias para que coincidan con admin.html)
const getPrayers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, author_name AS name, petition AS prayer, status, created_at 
            FROM prayers 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener oraciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una nueva petición de oración (formulario público)
const createPrayer = async (req, res) => {
    const { author_name, petition } = req.body;
    try {
        const query = `
            INSERT INTO prayers (author_name, petition, status)
            VALUES ($1, $2, 'pending')
            RETURNING *;
        `;
        const values = [author_name || 'Anónimo', petition];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Petición de oración enviada con éxito 🙏', prayer: result.rows[0] });
    } catch (error) {
        console.error('Error al crear petición de oración:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar / Marcar como atendida una petición de oración (Panel admin)
const deletePrayer = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM prayers WHERE id = $1', [id]);
        res.json({ message: 'Petición atendida y retirada con éxito ✓' });
    } catch (error) {
        console.error('Error al eliminar oración:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getPrayers,
    createPrayer,
    deletePrayer
};