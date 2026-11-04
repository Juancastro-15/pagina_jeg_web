const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    getSermons, 
    createSermon, 
    updateSermon, 
    deleteSermon 
} = require('../controllers/sermonController');

// Importar el middleware de autenticación
const verifyToken = require('../middlewares/authMiddleware');

// Configuración de Multer para almacenar las fotos localmente en public/uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'sermon-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Middleware multer (máximo 4 archivos con el campo "images")
const upload = multer({ 
    storage: storage,
    limits: { files: 4 }
});

// Ruta pública: Ver prédicas
router.get('/', getSermons);

// Ruta protegida: Crear prédica (Con autenticación y subida de 2 a 4 fotos)
router.post('/', verifyToken, upload.array('images', 4), createSermon);

// Ruta protegida: Actualizar prédica por ID (PUT)
router.put('/:id', verifyToken, upload.array('images', 4), updateSermon);

// Ruta protegida: Eliminar prédica por ID (DELETE)
router.delete('/:id', verifyToken, deleteSermon);

module.exports = router;