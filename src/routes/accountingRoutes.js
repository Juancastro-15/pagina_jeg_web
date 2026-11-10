const express = require('express');
const router = express.Router();
const { 
    getTransactions, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
} = require('../controllers/accountingController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Middleware para manejar archivos (Cloudinary / Multer)

// Ruta protegida: Ver todas las transacciones
router.get('/', verifyToken, getTransactions);

// Ruta pública o protegida: Registrar una nueva transacción (Ingreso/Egreso) con opción de comprobante (receipt)
router.post('/', upload.single('receipt'), createTransaction);

// Ruta protegida: Actualizar (Editar) una transacción existente
router.put('/:id', verifyToken, upload.single('receipt'), updateTransaction);

// Ruta protegida: Eliminar una transacción
router.delete('/:id', verifyToken, deleteTransaction);

module.exports = router;