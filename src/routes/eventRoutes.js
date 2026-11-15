const express = require('express');
const router = express.Router();
const { 
    getEvents, 
    createEvent, 
    registerEvent, 
    getEventRegistrations, 
    deleteEvent 
} = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Middleware de Multer/Cloudinary

// Ruta pública: Ver todos los eventos
router.get('/', getEvents);

// Ruta pública: Registrar asistencia a un evento (con subida de comprobante/voucher a Cloudinary)
router.post('/register', upload.single('receipt'), registerEvent);

// Ruta protegida: Obtener todas las inscripciones para el panel de admin
router.get('/registrations', verifyToken, getEventRegistrations);

// Ruta protegida: Crear evento con hasta 3 imágenes (SOLO ADMINS / PASTORES)
router.post('/', verifyToken, upload.array('images', 3), createEvent);

// Ruta protegida: Eliminar un evento
router.delete('/:id', verifyToken, deleteEvent);

module.exports = router;