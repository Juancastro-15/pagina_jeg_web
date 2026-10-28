const pool = require('../config/db');

// Obtener todas las donaciones (para administradores)
const getDonations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener donaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Registrar una nueva donación / ofrenda
const createDonation = async (req, res) => {
    const { donor_name, amount, currency, payment_method, reference_code } = req.body;
    try {
        const query = `
            INSERT INTO donations (donor_name, amount, currency, payment_method, reference_code, status)
            VALUES ($1, $2, $3, $4, $5, 'pending')
            RETURNING *;
        `;
        const values = [donor_name || 'Anónimo', amount, currency || 'COP', payment_method, reference_code];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Donación registrada con éxito 💛', donation: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar donación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getDonations,
    createDonation
};