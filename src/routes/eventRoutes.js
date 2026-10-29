const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Ver eventos
router.get('/', getEvents);

// Ruta protegida: Crear evento (SOLO ADMINS)
router.post('/', verifyToken, createEvent);

// Ruta protegida: Actualizar evento (SOLO ADMINS)
router.put('/:id', verifyToken, updateEvent);

// Ruta protegida: Eliminar evento (SOLO ADMINS)
router.delete('/:id', verifyToken, deleteEvent);

module.exports = router;