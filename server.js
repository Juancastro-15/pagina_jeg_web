const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 
const app = express();

// Middlewares globales
app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📂 Asegurar que la carpeta public/uploads exista automáticamente
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Carpeta public/uploads creada automáticamente.');
}

// 📂 Rutas de la API
const sermonRoutes = require('./src/routes/sermonRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const accountingRoutes = require('./src/routes/accountingRoutes'); 
const ministryRoutes = require('./src/routes/ministryRoutes');
const eventRoutes = require('./src/routes/eventRoutes'); // 👈 ¡Importamos las rutas de eventos!

app.use('/api/sermons', sermonRoutes); 
app.use('/api/auth', authRoutes);     
app.use('/api/accounting', accountingRoutes); 
app.use('/api/ministerios', ministryRoutes); 
app.use('/api/events', eventRoutes); // 👈 ¡Montamos las rutas de eventos en /api/events!

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});