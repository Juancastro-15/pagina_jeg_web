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

// Crear un nuevo evento
const createEvent = async (req, res) => {
    const { title, description, location, event_date, image_url } = req.body;
    try {
        const query = `
            INSERT INTO events (title, description, location, event_date, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [title, description, location, event_date, image_url];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Evento creado con éxito 📅', event: result.rows[0] });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getEvents,
    createEvent
};