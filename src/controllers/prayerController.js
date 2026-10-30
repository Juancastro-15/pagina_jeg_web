const pool = require('../config/db');

// Obtener peticiones de oración aprobadas (para la web pública)
const getPrayers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM prayers WHERE status = 'approved' ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener oraciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una nueva petición de oración
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

module.exports = {
    getPrayers,
    createPrayer
};