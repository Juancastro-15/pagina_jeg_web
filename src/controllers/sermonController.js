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
    const { title, description, speaker, video_url, audio_url, date, category } = req.body;
    // Manejo flexible por si en frontend envían video_url o link
    const finalVideoUrl = video_url || req.body.link; 

    try {
        const query = `
            INSERT INTO sermons (title, description, speaker, video_url, audio_url, date, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [title, description, speaker, finalVideoUrl, audio_url, date, category || 'Culto'];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Prédica creada con éxito 📖', sermon: result.rows[0] });
    } catch (error) {
        console.error('Error al crear la prédica:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una prédica existente (PUT)
const updateSermon = async (req, res) => {
    const { id } = req.params;
    const { title, description, speaker, video_url, audio_url, date, category } = req.body;
    const finalVideoUrl = video_url || req.body.link;

    try {
        const query = `
            UPDATE sermons 
            SET title = $1, description = $2, speaker = $3, video_url = $4, audio_url = $5, date = $6, category = $7
            WHERE id = $8
            RETURNING *;
        `;
        const values = [title, description, speaker, finalVideoUrl, audio_url, date, category || 'Culto', id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prédica no encontrada' });
        }

        res.json({ message: 'Prédica actualizada con éxito 🔄', sermon: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar la prédica:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una prédica (DELETE)
const deleteSermon = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM sermons WHERE id = $1 RETURNING *;', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prédica no encontrada' });
        }

        res.json({ message: 'Prédica eliminada con éxito 🗑️' });
    } catch (error) {
        console.error('Error al eliminar la prédica:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Exportar todos los controladores correctamente
module.exports = {
    getSermons,
    createSermon,
    updateSermon,
    deleteSermon
};