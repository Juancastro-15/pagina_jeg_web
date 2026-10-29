const express = require('express');
const router = express.Router();
const { 
    getSermons, 
    createSermon, 
    updateSermon, 
    deleteSermon 
} = require('../controllers/sermonController');

// Importar el middleware de autenticación que creamos
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Ver prédicas (cualquiera puede entrar a la web)
router.get('/', getSermons);

// Ruta protegida: Crear prédica (SOLO administradores con Token JWT)
router.post('/', verifyToken, createSermon);

// Ruta protegida: Actualizar prédica por ID (PUT)
router.put('/:id', verifyToken, updateSermon);

// Ruta protegida: Eliminar prédica por ID (DELETE)
router.delete('/:id', verifyToken, deleteSermon);

module.exports = router;