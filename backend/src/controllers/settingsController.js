const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des paramètres'
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    // Update all fields from request body
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        settings[key] = updates[key];
      }
    });

    await settings.save();

    res.json({
      success: true,
      settings,
      message: 'Paramètres mis à jour avec succès'
    });

  } catch (error) {
    console.error('Update settings error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des paramètres'
    });
  }
};

// @desc    Toggle maintenance mode
// @route   PATCH /api/settings/maintenance
// @access  Private
const toggleMaintenance = async (req, res) => {
  try {
    const { enabled, message } = req.body;
    const settings = await Settings.getSettings();

    settings.maintenance = {
      enabled: enabled !== undefined ? enabled : !settings.maintenance.enabled,
      message: message || settings.maintenance.message || 'Site en maintenance, revenez bientôt !'
    };

    await settings.save();

    res.json({
      success: true,
      maintenance: settings.maintenance,
      message: `Mode maintenance ${settings.maintenance.enabled ? 'activé' : 'désactivé'}`
    });

  } catch (error) {
    console.error('Toggle maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mode maintenance'
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  toggleMaintenance
};