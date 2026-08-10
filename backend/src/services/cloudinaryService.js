const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { isConfigured } = require('../config/cloudinary');

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a single image to Cloudinary
 */
const uploadImage = (file, folder = 'products') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary is not configured, return a demo URL
    if (!isConfigured) {
      console.warn('Cloudinary non configuré - utilisation d\'une URL de démo');
      return resolve({
        url: `https://res.cloudinary.com/demo/image/upload/v1/${folder}/demo-${Date.now()}`,
        publicId: `demo-${folder}-${Date.now()}`
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `gla-gla-business/${folder}`,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
          { width: 1200, crop: 'limit' }
        ],
        allowed_formats: ['jpg', 'png', 'gif', 'webp', 'svg']
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error('Erreur lors du téléchargement de l\'image'));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      }
    );

    // Convert buffer to stream
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

/**
 * Upload multiple images to Cloudinary
 */
const uploadMultipleImages = async (files, folder = 'products') => {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return await Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 */
const deleteImage = async (publicId) => {
  // If Cloudinary is not configured, skip deletion
  if (!isConfigured) {
    console.warn('Cloudinary non configuré - suppression ignorée');
    return { result: 'ok' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Erreur lors de la suppression de l\'image');
  }
};

/**
 * Delete multiple images from Cloudinary
 */
const deleteImages = async (publicIds) => {
  const deletePromises = publicIds.map(id => deleteImage(id));
  return await Promise.all(deletePromises);
};

/**
 * Extract public ID from Cloudinary URL
 */
const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${publicId}`;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteImages,
  extractPublicId,
  isConfigured
};