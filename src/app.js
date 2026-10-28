const express = require('express');
const cors = require('cors');

// Importar rutas
const sermonRoutes = require('./routes/sermonRoutes');
const eventRoutes = require('./routes/eventRoutes');
const prayerRoutes = require('./routes/prayerRoutes');
const donationRoutes = require('./routes/donationRoutes');
const authRoutes = require('./routes/authRoutes');

// Importar middleware de protección (si quieres blindar rutas específicas después)
const verifyToken = require('./middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas y de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/donations', donationRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API de la Iglesia funcionando al 100% ⛪' });
});

module.exports = app;