const express = require('express');
const router = express.Router();
const { getPrayers, createPrayer } = require('../controllers/prayerController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Cualquier persona puede enviar su petición de oración
router.post('/', createPrayer);

// Ruta protegida: Solo los administradores pueden ver la lista de peticiones privadas
router.get('/', verifyToken, getPrayers);

module.exports = router;