const express = require('express');
const router = express.Router();
const { 
    registerAdmin, 
    loginAdmin, 
    getUsers, 
    deleteUser, 
    updateUserPassword 
} = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware'); 
const verifyRole = require('../middlewares/roleMiddleware'); // 🛡️ Validador de roles

// Ruta de login (Pública)
router.post('/login', loginAdmin);

// Rutas protegidas (🔒 Solo Administradores y Pastores pueden gestionar usuarios)
router.post('/register', verifyToken, verifyRole(['admin', 'pastor']), registerAdmin);
router.get('/users', verifyToken, verifyRole(['admin', 'pastor']), getUsers);
router.delete('/users/:id', verifyToken, verifyRole(['admin', 'pastor']), deleteUser);
router.put('/users/:id/password', verifyToken, verifyRole(['admin', 'pastor']), updateUserPassword);

module.exports = router;