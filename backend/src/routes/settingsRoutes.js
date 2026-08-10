const express = require('express');
const {
  getSettings,
  updateSettings,
  toggleMaintenance
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getSettings);

// Protected routes
router.put('/', protect, updateSettings);
router.patch('/maintenance', protect, toggleMaintenance);

module.exports = router;