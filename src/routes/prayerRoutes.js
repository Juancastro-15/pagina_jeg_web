const express = require('express');
const router = express.Router();
const { getPrayers, createPrayer, deletePrayer } = require('../controllers/prayerController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Cualquier persona puede enviar su petición de oración[cite: 2]
router.post('/', createPrayer);

// Ruta protegida: Solo los administradores pueden ver la lista de peticiones privadas[cite: 2]
router.get('/', verifyToken, getPrayers);

// Ruta protegida: Eliminar / marcar como atendida una petición
router.delete('/:id', verifyToken, deletePrayer);

module.exports = router;