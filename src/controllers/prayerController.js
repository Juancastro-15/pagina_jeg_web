const pool = require('../config/db');

// Obtener todas las peticiones
const getPrayers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM prayers ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener peticiones:', err);
        res.status(500).json({ error: 'Error al obtener las peticiones' });
    }
};

// Crear una nueva petición
const createPrayer = async (req, res) => {
    const { name, request } = req.body;
    try {
        const query = 'INSERT INTO prayers (name, request) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [name, request]);
        res.status(201).json({ message: 'Petición enviada con éxito', prayer: result.rows[0] });
    } catch (err) {
        console.error('Error al crear petición:', err);
        res.status(500).json({ error: 'Error al crear la petición' });
    }
};

// Eliminar / Atender una petición
const deletePrayer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM prayers WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Petición no encontrada.' });
        }
        res.json({ message: 'Petición atendida y eliminada correctamente.' });
    } catch (err) {
        console.error('Error al eliminar petición:', err);
        res.status(500).json({ error: 'Error al eliminar la petición' });
    }
};

module.exports = {
    getPrayers,
    createPrayer,
    deletePrayer
};