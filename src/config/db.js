const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión con Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;