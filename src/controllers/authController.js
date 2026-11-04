const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens
const JWT_SECRET = process.env.JWT_SECRET || 'clerical_secure_secret_key_2026';

// Registrar un nuevo usuario con roles (admin, pastor, secretary, contador)
const registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const userRole = role || 'secretary';

        const query = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at;
        `;
        const result = await pool.query(query, [name, email, password_hash, userRole]);

        res.status(201).json({
            message: 'Usuario registrado con éxito 🔐',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Iniciar sesión (Login)
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos)' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos)' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Inicio de sesión exitoso 🚀',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 👥 Obtener todos los usuarios registrados
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🗑️ Eliminar un usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado con éxito 🗑️' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🔑 Actualizar la contraseña de un usuario
const updateUserPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        if (!password || password.trim() === "") {
            return res.status(400).json({ error: 'La nueva contraseña es obligatoria' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, name, email, role;',
            [password_hash, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Contraseña actualizada con éxito 🔑', user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getUsers,
    deleteUser,
    updateUserPassword
};