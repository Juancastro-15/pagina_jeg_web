const express = require('express');
const router = express.Router();
const { getPrayers, createPrayer, deletePrayer } = require('../controllers/prayerController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Cualquier persona puede enviar su petición de oración
router.post('/', createPrayer);

// Ruta protegida: Solo los administradores/secretarios pueden ver la lista de peticiones
router.get('/', verifyToken, getPrayers);

// Ruta protegida: Eliminar / atender una petición
router.delete('/:id', verifyToken, deletePrayer);

module.exports = router;