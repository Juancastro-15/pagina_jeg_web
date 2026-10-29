const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/accountingController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta protegida: Solo el personal autorizado (Admin/Pastor/Contador) puede ver los reportes financieros
router.get('/', verifyToken, getTransactions);

// Ruta pública: Los hermanos pueden registrar sus diezmos y ofrendas desde la web
router.post('/', createTransaction);

module.exports = router;