const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Vérifier la configuration
const testCloudinaryConnection = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️ Cloudinary non configuré. Les images seront en mode démo.');
    return false;
  }
  return true;
};

module.exports = {
  cloudinary,
  isConfigured: testCloudinaryConnection()
};