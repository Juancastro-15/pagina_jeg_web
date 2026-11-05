const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Middleware de Multer/Cloudinary

// Ruta pública: Ver todos los eventos
router.get('/', getEvents);

// Ruta protegida: Crear evento con hasta 3 imágenes (SOLO ADMINS / USUARIOS AUTENTICADOS)
router.post('/', verifyToken, upload.array('images', 3), createEvent);

// Ruta protegida: Eliminar un evento
router.delete('/:id', verifyToken, deleteEvent);

module.exports = router;