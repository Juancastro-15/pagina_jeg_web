const express = require('express');
const router = express.Router();
const { getPrayers, createPrayer, deletePrayer } = require('../controllers/prayerController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública para RECIBIR (POST) peticiones de oración o formulario de ministerios
router.post('/', createPrayer); 

// Rutas protegidas para ver y eliminar
router.get('/', verifyToken, getPrayers);
router.delete('/:id', verifyToken, deletePrayer);

module.exports = router;