const pool = require('../config/db');

// Obtener todas las solicitudes de ministerios (para administración)
const getMinistryRequests = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ministry_requests ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener solicitudes de ministerios:', err);
        res.status(500).json({ error: 'Error al obtener las solicitudes de ministerios' });
    }
};

// Crear una nueva solicitud de servicio en un ministerio
const createMinistryRequest = async (req, res) => {
    const { name, phone, ministry_name, notes } = req.body;
    try {
        const query = `
            INSERT INTO ministry_requests (name, phone, ministry_name, notes) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
        const values = [name, phone, ministry_name, notes || ''];
        const result = await pool.query(query, values);
        
        res.status(201).json({ 
            message: 'Solicitud de ministerio enviada con éxito', 
            data: result.rows[0] 
        });
    } catch (err) {
        console.error('Error al crear solicitud de ministerio:', err);
        res.status(500).json({ error: 'Error al procesar la solicitud del ministerio' });
    }
};

// Eliminar / Atender solicitud de ministerio
const deleteMinistryRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM ministry_requests WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }
        res.json({ message: 'Solicitud atendida y eliminada correctamente.' });
    } catch (err) {
        console.error('Error al eliminar solicitud de ministerio:', err);
        res.status(500).json({ error: 'Error al eliminar la solicitud' });
    }
};

module.exports = {
    getMinistryRequests,
    createMinistryRequest,
    deleteMinistryRequest
};