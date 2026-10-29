const express = require('express');
const path = require('path');
const cors = require('cors'); // 👈 1. Importar cors
const app = express();

// Middlewares globales
app.use(cors()); // 👈 2. Habilitar CORS para permitir peticiones desde Vercel
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📂 Rutas de la API
const sermonRoutes = require('./src/routes/sermonRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const accountingRoutes = require('./src/routes/accountingRoutes'); // 👈 3. Importar rutas contables

app.use('/api/sermons', sermonRoutes); 
app.use('/api/auth', authRoutes);     
app.use('/api/accounting', accountingRoutes); // 👈 4. Registrar la ruta base de contabilidad/donaciones

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});