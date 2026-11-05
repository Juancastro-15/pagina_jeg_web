const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'qonryvvs',
    api_key: '817954114899791',
    api_secret: 'CryFPmpqDEFhAgKzyaoBF7MvFjw'
});

module.exports = cloudinary;