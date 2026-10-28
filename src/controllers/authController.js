const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens (Idealmente debería ir en el archivo .env)
const JWT_SECRET = process.env.JWT_SECRET || 'clerical_secure_secret_key_2026';

// Registrar un nuevo usuario con roles (admin, pastor, secretary, contador)
const registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Verificar si el usuario ya existe
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Definir el rol (si no envían ninguno, por defecto será 'secretary')
        const userRole = role || 'secretary';

        // Guardar en la base de datos
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
        // Buscar el usuario por correo
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos)' });
        }

        const user = result.rows[0];

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos)' });
        }

        // Generar el Token JWT (incluyendo el rol del usuario, expira en 8 horas)
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

module.exports = {
    registerAdmin,
    loginAdmin
};