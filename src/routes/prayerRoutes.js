const express = require('express');
const router = express.Router();
const { getPrayers, getAllPrayers, createPrayer, deletePrayer } = require('../controllers/prayerController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Cualquier persona puede enviar su petición de oración
router.post('/', createPrayer);

// Ruta protegida: Solo los administradores pueden ver la lista de peticiones privadas
router.get('/', verifyToken, getAllPrayers);

// Ruta pública: solo las peticiones aprobadas (por si la web pública muestra un muro)
router.get('/approved', getPrayers);

// Ruta protegida: marcar una petición como atendida
router.delete('/:id', verifyToken, deletePrayer);

module.exports = router;