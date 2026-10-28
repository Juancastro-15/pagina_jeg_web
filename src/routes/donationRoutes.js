const express = require('express');
const router = express.Router();
const { getDonations, createDonation } = require('../controllers/donationController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta protegida: Solo los administradores pueden ver el historial y reportes de donaciones
router.get('/', verifyToken, getDonations);

// Ruta para registrar donaciones (o recibir pasarela)
router.post('/', createDonation);

module.exports = router;