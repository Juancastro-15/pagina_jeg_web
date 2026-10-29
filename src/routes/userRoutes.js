const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // 👈 Importante: aquí se define el pool para que no dé error
const verifyToken = require('../middlewares/authMiddleware');

// 1. Listar todos los usuarios
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// 2. Actualizar un usuario
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    try {
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // Usando password_hash en lugar de password para coincidir con la base de datos
            const query = 'UPDATE users SET name = $1, email = $2, role = $3, password_hash = $4 WHERE id = $5 RETURNING id, name, email, role, created_at';
            const updated = await pool.query(query, [name, email, role, hashedPassword, id]);
            return res.json(updated.rows[0]);
        } else {
            const query = 'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role, created_at';
            const updated = await pool.query(query, [name, email, role, id]);
            return res.json(updated.rows[0]);
        }
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

// 3. Eliminar un usuario
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

module.exports = router;