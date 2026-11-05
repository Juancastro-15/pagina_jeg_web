const pool = require('../config/db');

// Obtener todos los eventos
const getEvents = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un nuevo evento (Soporte para hasta 3 fotos en Cloudinary y control de costos)
const createEvent = async (req, res) => {
    const { title, description, location, event_date, cost, is_free } = req.body;
    try {
        // Extraer las URLs de los archivos subidos a Cloudinary (hasta 3 fotos)
        const images_urls = req.files ? req.files.map(file => file.path) : [];

        // Evaluar si la entrada es gratuita o con costo
        const isFreeEvent = is_free === 'true' || is_free === true || !cost || parseFloat(cost) === 0;

        const query = `
            INSERT INTO events (title, description, location, event_date, images_urls, cost, is_free)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [
            title, 
            description || '', 
            location || 'Sede Principal', 
            event_date, 
            images_urls, 
            isFreeEvent ? 0 : parseFloat(cost), 
            isFreeEvent
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Evento creado con éxito 📅✨', event: result.rows[0] });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un evento existente
const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *;', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado con éxito 🗑️' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getEvents,
    createEvent,
    deleteEvent
};