const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Ver eventos
router.get('/', getEvents);

// Ruta protegida: Crear evento (SOLO ADMINS)
router.post('/', verifyToken, createEvent);

module.exports = router;