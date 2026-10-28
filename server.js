const express = require('express');
const path = require('path');
const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📂 Rutas de la API
const sermonRoutes = require('./src/routes/sermonRoutes'); 
const authRoutes = require('./src/routes/authRoutes'); // 👈 Importamos las rutas de autenticación

app.use('/api/sermons', sermonRoutes); // Rutas públicas (GET) y protegidas (POST) de prédicas
app.use('/api/auth', authRoutes);     // Rutas de registro y login de administradores (/api/auth/login)

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});