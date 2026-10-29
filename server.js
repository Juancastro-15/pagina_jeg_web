const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================
app.use(cors()); // Permite peticiones cross-origin desde el frontend
app.use(express.json()); // Parsea el cuerpo de las peticiones HTTP en formato JSON
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos

// ==========================================
// IMPORTACIÓN DE RUTAS DE LA API
// ==========================================
const sermonRoutes = require('./src/routes/sermonRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const accountingRoutes = require('./src/routes/accountingRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const userRoutes = require('./src/routes/userRoutes');
const prayerRoutes = require('./src/routes/prayerRoutes');
const ministryRoutes = require('./src/routes/ministryRoutes'); // 👈 Nueva ruta exclusiva para ministerios

// ==========================================
// REGISTRO DE RUTAS BASE
// ==========================================
app.use('/api/sermons', sermonRoutes);        // Prédicas y transmisiones
app.use('/api/auth', authRoutes);            // Autenticación y registro inicial
app.use('/api/accounting', accountingRoutes);  // Finanzas, diezmos y ofrendas
app.use('/api/events', eventRoutes);          // Gestión de eventos y actividades
app.use('/api/users', userRoutes);            // Administración de usuarios
app.use('/api/prayers', prayerRoutes);        // Peticiones de oración
app.use('/api/ministerios', ministryRoutes);  // 👈 Endpoints para solicitudes de ministerios

// Ruta base de prueba/salud de la API
app.get('/', (req, res) => {
    res.send('API de la Iglesia Internacional Jehová es Gloria funcionando correctamente 🚀');
});

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
});