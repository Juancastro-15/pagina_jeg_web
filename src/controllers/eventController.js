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
        const images_urls = req.files ? req.files.map(file => file.path) : [];
        const isFreeEvent = is_free === 'true' || is_free === true || !cost || parseFloat(cost) === 0;

        let finalEventDate = event_date;
        if (event_date) {
            const dateObj = new Date(event_date);
            dateObj.setHours(dateObj.getHours() + 5);
            finalEventDate = dateObj;
        }

        const query = `
            INSERT INTO events (title, description, location, event_date, images_urls, cost, is_free)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [
            title, 
            description || '', 
            location || 'Sede Principal', 
            finalEventDate, 
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

// 🎟️ Registrar la inscripción a un evento (con soporte para adjuntar comprobante)
const registerEvent = async (req, res) => {
    try {
        const { event_id, name, phone, email } = req.body;
        const receiptUrl = req.file ? req.file.path : null;

        const query = `
            INSERT INTO event_registrations (event_id, name, phone, email, receipt_url, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *;
        `;
        const values = [event_id, name, phone, email, receiptUrl];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: '¡Inscripción registrada con éxito! 🎟️',
            registration: result.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar en el evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 📋 Obtener todas las inscripciones para el panel de administración
const getEventRegistrations = async (req, res) => {
    try {
        const query = `
            SELECT er.*, e.title AS event_title, e.cost AS event_cost, e.is_free
            FROM event_registrations er
            LEFT JOIN events e ON er.event_id = e.id
            ORDER BY er.created_at DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🗑️ Eliminar una inscripción específica
const deleteEventRegistration = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM event_registrations WHERE id = $1 RETURNING *;', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        res.json({ message: 'Inscripción eliminada con éxito 🗑️' });
    } catch (error) {
        console.error('Error al eliminar inscripción:', error);
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
    registerEvent,
    getEventRegistrations,
    deleteEventRegistration,
    deleteEvent
};