const pool = require('../config/db');

// Obtener todas las peticiones para el panel admin (con alias para que coincidan con admin.html)
const getPrayers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                author_name AS name, 
                phone_code,
                phone,
                email,
                petition AS prayer, 
                privacy_accepted,
                status, 
                created_at 
            FROM prayers 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener oraciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una nueva petición de oración (formulario público)
const createPrayer = async (req, res) => {
    // Soportamos tanto los nombres que envía prayer.html (name, request) como los alternativos (author_name, petition)
    const author_name = (req.body.name || req.body.author_name || 'Anónimo').trim();
    const petition = (req.body.request || req.body.petition || '').trim();
    const phone_code = (req.body.phone_code || '+57').trim();
    const phone = req.body.phone ? req.body.phone.trim() : null;
    const email = req.body.email ? req.body.email.trim() : null;
    const privacy_accepted = Boolean(req.body.privacy_accepted);

    if (!petition) {
        return res.status(400).json({ error: 'La petición de oración no puede estar vacía' });
    }

    if (!privacy_accepted) {
        return res.status(400).json({ error: 'Debes aceptar la Política de Privacidad y el tratamiento de datos personales' });
    }

    try {
        const query = `
            INSERT INTO prayers (author_name, phone_code, phone, email, petition, privacy_accepted, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING *;
        `;
        const values = [author_name, phone_code, phone, email, petition, privacy_accepted];
        const result = await pool.query(query, values);

        res.status(201).json({ 
            message: 'Petición de oración enviada con éxito 🙏', 
            prayer: result.rows[0] 
        });
    } catch (error) {
        console.error('Error al crear petición de oración:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar / Marcar como atendida una petición de oración (Panel admin)
const deletePrayer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM prayers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Petición no encontrada' });
        }
        res.json({ message: 'Petición atendida y retirada con éxito ✓' });
    } catch (error) {
        console.error('Error al eliminar oración:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getPrayers,
    createPrayer,
    deletePrayer
};