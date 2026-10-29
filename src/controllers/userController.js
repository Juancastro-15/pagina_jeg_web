const bcrypt = require('bcrypt');
// Ajusta la ruta a tu conexión de PostgreSQL si es diferente (por ejemplo, '../../config/db' o '../db')
const pool = require('../config/db'); 

/**
 * Obtener todos los usuarios de la base de datos
 * GET /api/users
 */
const getUsers = async (req, res) => {
    try {
        const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error en getUsers:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener la lista de usuarios.' });
    }
};

/**
 * Actualizar información de un usuario
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    try {
        // Verificar si el usuario existe antes de actualizar
        const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (checkUser.rows.length === 0) {
            return res.status(404).json({ error: 'El usuario especificado no existe.' });
        }

        // Si se proporciona una nueva contraseña válida, la ciframos con bcrypt
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const queryWithPassword = `
                UPDATE users 
                SET name = $1, email = $2, role = $3, password = $4 
                WHERE id = $5 
                RETURNING id, name, email, role;
            `;
            const updatedUser = await pool.query(queryWithPassword, [name, email, role, hashedPassword, id]);
            return res.status(200).json(updatedUser.rows[0]);
        } else {
            // Si no se envía contraseña, solo actualizamos los demás campos
            const queryWithoutPassword = `
                UPDATE users 
                SET name = $1, email = $2, role = $3 
                WHERE id = $4 
                RETURNING id, name, email, role;
            `;
            const updatedUser = await pool.query(queryWithoutPassword, [name, email, role, id]);
            return res.status(200).json(updatedUser.rows[0]);
        }
    } catch (err) {
        console.error('Error en updateUser:', err);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el usuario.' });
    }
};

/**
 * Eliminar un usuario por su ID
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'El usuario no fue encontrado o ya fue eliminado.' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente de la base de datos.' });
    } catch (err) {
        console.error('Error en deleteUser:', err);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar el usuario.' });
    }
};

module.exports = {
    getUsers,
    updateUser,
    deleteUser
};