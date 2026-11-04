const express = require('express');
const path = require('path');
const fs = require('fs'); // 👈 1. Importar el módulo de sistema de archivos
const cors = require('cors'); 
const app = express();

// Middlewares globales
app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📂 2. ASEGURAR QUE LA CARPETA PUBLIC/UPLOADS EXISTA AUTOMÁTICAMENTE
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Carpeta public/uploads creada automáticamente.');
}

// 📂 Rutas de la API
const sermonRoutes = require('./src/routes/sermonRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const accountingRoutes = require('./src/routes/accountingRoutes'); 

app.use('/api/sermons', sermonRoutes); 
app.use('/api/auth', authRoutes);     
app.use('/api/accounting', accountingRoutes); 

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});