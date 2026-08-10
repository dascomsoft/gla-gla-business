const express = require('express');
const { upload, handleMulterError } = require('../middleware/upload');
const cloudinaryService = require('../services/cloudinaryService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Upload single image
router.post('/image', protect, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier téléchargé'
      });
    }

    const folder = req.body.folder || 'products';
    const result = await cloudinaryService.uploadImage(req.file, folder);

    res.json({
      success: true,
      image: result.url,
      publicId: result.publicId
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement de l\'image'
    });
  }
});

// Upload multiple images
router.post('/images', protect, upload.array('images', 10), handleMulterError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier téléchargé'
      });
    }

    const folder = req.body.folder || 'products';
    const results = await cloudinaryService.uploadMultipleImages(req.files, folder);

    res.json({
      success: true,
      images: results.map(r => r.url),
      publicIds: results.map(r => r.publicId)
    });

  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement des images'
    });
  }
});

// Delete image
router.delete('/image', protect, async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID requis'
      });
    }

    await cloudinaryService.deleteImage(publicId);

    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'image'
    });
  }
});

module.exports = router;