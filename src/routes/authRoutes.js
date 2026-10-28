const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware'); 
const verifyRole = require('../middlewares/roleMiddleware'); // 🛡️ Importamos el validador de roles

// Ruta de login (Pública)
router.post('/login', loginAdmin);

// Ruta de registro (🔒 PROTEGIDA: Solo Admin o Pastor pueden registrar nuevos usuarios)
router.post('/register', verifyToken, verifyRole(['admin', 'pastor']), registerAdmin);

module.exports = router;