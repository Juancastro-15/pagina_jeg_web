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

// Actualizar un evento existente
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, event_date, image_url } = req.body;
    try {
        const query = `
            UPDATE events 
            SET title = $1, description = $2, location = $3, event_date = $4, image_url = $5 
            WHERE id = $6 
            RETURNING *;
        `;
        const values = [title, description, location, event_date, image_url, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento actualizado con éxito 🔄', event: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un evento
const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado correctamente 🗑️' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};