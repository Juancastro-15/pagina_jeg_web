const pool = require('../config/db');

// Obtener todas las prédicas
const getSermons = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sermons ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener prédicas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una nueva prédica (para el CMS)
const createSermon = async (req, res) => {
    const { title, description, speaker, video_url, audio_url, date } = req.body;
    try {
        const query = `
            INSERT INTO sermons (title, description, speaker, video_url, audio_url, date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [title, description, speaker, video_url, audio_url, date];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Prédica creada con éxito 📖', sermon: result.rows[0] });
    } catch (error) {
        console.error('Error al crear la prédica:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Exportar los controladores correctamente
module.exports = {
    getSermons,
    createSermon
};