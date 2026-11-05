const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Asegúrate de que apunte a tu configuración de cloudinary

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'iglesia_jehova_es_gloria',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

module.exports = upload;