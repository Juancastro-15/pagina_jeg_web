const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { 
    getSermons, 
    createSermon, 
    updateSermon, 
    deleteSermon 
} = require('../controllers/sermonController');

// Importar el middleware de autenticación
const verifyToken = require('../middlewares/authMiddleware');

// Configuración de Cloudinary con tus credenciales oficiales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'qonryvvs',
  api_key: process.env.CLOUDINARY_API_KEY || '817954114899791',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'CryFPmpqDEFhAgKzyaoBF7MvFjw'
});

// Configuración del almacenamiento para subir directamente a la nube de Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'predicas_iglesia', // Carpeta en tu cuenta de Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

// Middleware multer (máximo 4 archivos con el campo "images")
const upload = multer({ 
    storage: storage,
    limits: { files: 4 }
});

// Ruta pública: Ver prédicas
router.get('/', getSermons);

// Ruta protegida: Crear prédica (Con autenticación y subida de 2 a 4 fotos a Cloudinary)
router.post('/', verifyToken, upload.array('images', 4), createSermon);

// Ruta protegida: Actualizar prédica por ID (PUT)
router.put('/:id', verifyToken, upload.array('images', 4), updateSermon);

// Ruta protegida: Eliminar prédica por ID (DELETE)
router.delete('/:id', verifyToken, deleteSermon);

module.exports = router;