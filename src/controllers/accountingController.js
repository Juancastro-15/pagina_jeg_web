const pool = require('../config/db');

// Obtener todas las transacciones (Para la tabla contable del admin)
const getTransactions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener contabilidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Registrar una nueva ofrenda, diezmo o donación (Público desde donations.html)
const createTransaction = async (req, res) => {
    const { type, amount, donor_name, payment_method, reference } = req.body;
    try {
        const query = `
            INSERT INTO transactions (type, amount, donor_name, payment_method, reference)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [type, amount, donor_name || 'Anónimo', payment_method, reference || 'N/A'];
        const result = await pool.query(query, values);
        res.status(201).json({ message: '¡Gracias por tu generosidad! Transacción registrada 🤲✨', transaction: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getTransactions,
    createTransaction
};