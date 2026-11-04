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

// Crear una nueva prédica (con soporte para múltiples fotos)
const createSermon = async (req, res) => {
    const { title, description, speaker, video_url, audio_url, date, category } = req.body;
    const finalVideoUrl = video_url || req.body.link; 

    try {
        // Mapear los archivos subidos por multer a un arreglo de URLs relativas
        const images_urls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const query = `
            INSERT INTO sermons (title, description, speaker, video_url, audio_url, date, category, images_urls)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            title, 
            description, 
            speaker, 
            finalVideoUrl, 
            audio_url || null, 
            date, 
            category || 'Culto', 
            images_urls
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Prédica creada con éxito 📖📷', sermon: result.rows[0] });
    } catch (error) {
        console.error('Error al crear la prédica:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una prédica existente (PUT - soporte para conservar/eliminar fotos anteriores y agregar nuevas)
const updateSermon = async (req, res) => {
    const { id } = req.params;
    const { title, description, speaker, video_url, audio_url, date, category, existing_images } = req.body;
    const finalVideoUrl = video_url || req.body.link;

    try {
        // 1. Procesar las fotos anteriores que el administrador decidió conservar
        let images_urls = [];
        if (existing_images) {
            try {
                images_urls = JSON.parse(existing_images);
            } catch (e) {
                images_urls = [];
            }
        }

        // 2. Si se subieron fotos nuevas, las agregamos al arreglo
        if (req.files && req.files.length > 0) {
            const nuevasFotos = req.files.map(file => `/uploads/${file.filename}`);
            images_urls = [...images_urls, ...nuevasFotos];
        }

        const query = `
            UPDATE sermons 
            SET title = $1, description = $2, speaker = $3, video_url = $4, audio_url = $5, date = $6, category = $7, images_urls = $8
            WHERE id = $9
            RETURNING *;
        `;
        const values = [
            title, 
            description, 
            speaker, 
            finalVideoUrl, 
            audio_url || null, 
            date, 
            category || 'Culto', 
            images_urls, 
            id
        ];

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

module.exports = {
    getSermons,
    createSermon,
    updateSermon,
    deleteSermon
};