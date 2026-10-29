const express = require('express');
const router = express.Router();
const { 
    getMinistryRequests, 
    createMinistryRequest, 
    deleteMinistryRequest 
} = require('../controllers/ministryController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública para enviar formulario desde ministerios.html
router.post('/', createMinistryRequest);

// Rutas protegidas para el panel de administración
router.get('/', verifyToken, getMinistryRequests);
router.delete('/:id', verifyToken, deleteMinistryRequest);

module.exports = router;