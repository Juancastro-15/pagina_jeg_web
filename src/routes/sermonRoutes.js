const express = require('express');
const router = express.Router();
const { getSermons, createSermon } = require('../controllers/sermonController');

// Importar el middleware de autenticación que creamos
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Ver prédicas (cualquiera puede entrar a la web)
router.get('/', getSermons);

// Ruta protegida: Crear prédica (SOLO administradores con Token JWT)
router.post('/', verifyToken, createSermon);

module.exports = router;