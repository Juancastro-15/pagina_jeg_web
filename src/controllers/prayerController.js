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

// Obtener TODAS las peticiones (pendientes y aprobadas) para el panel de administración
const getAllPrayers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM prayers ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener todas las oraciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Marcar una petición como atendida (la retira del muro)
const deletePrayer = async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM prayers WHERE id = $1 RETURNING id", [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Petición no encontrada' });
        }
        res.json({ message: 'Petición atendida y retirada del muro' });
    } catch (error) {
        console.error('Error al eliminar petición de oración:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getPrayers,
    getAllPrayers,
    createPrayer,
    deletePrayer
};