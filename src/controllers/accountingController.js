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

// Registrar una nueva transacción (Ingreso o Egreso) con soporte opcional de comprobante
const createTransaction = async (req, res) => {
    const { type, amount, donor_name, payment_method, reference } = req.body;
    try {
        // Obtener la URL del comprobante si se subió una imagen (Cloudinary)
        const receipt_url = req.file ? req.file.path : null;

        const query = `
            INSERT INTO transactions (type, amount, donor_name, payment_method, reference, receipt_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            type, 
            parseFloat(amount), 
            donor_name || 'Anónimo / General', 
            payment_method || 'Efectivo', 
            reference || 'N/A',
            receipt_url
        ];
        
        const result = await pool.query(query, values);
        res.status(201).json({ message: '¡Transacción registrada con éxito! 💰✨', transaction: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar (Editar) una transacción existente
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { type, amount, donor_name, payment_method, reference } = req.body;
    try {
        // Verificar si se subió un nuevo comprobante
        const new_receipt_url = req.file ? req.file.path : null;

        let query, values;

        if (new_receipt_url) {
            query = `
                UPDATE transactions 
                SET type = $1, amount = $2, donor_name = $3, payment_method = $4, reference = $5, receipt_url = $6
                WHERE id = $7
                RETURNING *;
            `;
            values = [type, parseFloat(amount), donor_name, payment_method, reference, new_receipt_url, id];
        } else {
            query = `
                UPDATE transactions 
                SET type = $1, amount = $2, donor_name = $3, payment_method = $4, reference = $5
                WHERE id = $7
                RETURNING *;
            `;
            values = [type, parseFloat(amount), donor_name, payment_method, reference, id];
            // Nota: ajusta el índice si manejas 6 parámetros en el segundo query sin la foto
        }

        // Simplificando la actualización dinámica de forma limpia:
        const updateQuery = `
            UPDATE transactions 
            SET type = COALESCE($1, type), 
                amount = COALESCE($2, amount), 
                donor_name = COALESCE($3, donor_name), 
                payment_method = COALESCE($4, payment_method), 
                reference = COALESCE($5, reference),
                receipt_url = COALESCE($6, receipt_url)
            WHERE id = $7
            RETURNING *;
        `;
        const updateValues = [
            type, 
            amount ? parseFloat(amount) : null, 
            donor_name, 
            payment_method, 
            reference, 
            new_receipt_url, 
            id
        ];

        const result = await pool.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }

        res.json({ message: '¡Transacción actualizada con éxito! 🔄✨', transaction: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una transacción
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *;', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }

        res.json({ message: 'Transacción eliminada con éxito 🗑️' });
    } catch (error) {
        console.error('Error al eliminar transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
};