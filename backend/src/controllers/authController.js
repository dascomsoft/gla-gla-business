const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Check if account is active
    if (!admin.active) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé. Contactez l\'administrateur.'
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      const remainingTime = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(401).json({
        success: false,
        message: `Compte verrouillé pour ${remainingTime} minutes`
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      // Increment login attempts
      await admin.incrementLoginAttempts();
      const attemptsLeft = 5 - admin.loginAttempts;
      return res.status(401).json({
        success: false,
        message: `Email ou mot de passe incorrect. ${attemptsLeft} tentatives restantes.`
      });
    }

    // Reset login attempts on success
    await admin.resetLoginAttempts();
    await admin.updateOne({ lastLogin: Date.now() });

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin non trouvé'
      });
    }

    res.json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du profil'
    });
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');
    
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe'
    });
  }
};

module.exports = {
  login,
  getMe,
  logout,
  changePassword
};