const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  whatsappNumber: {
    type: String,
    required: [true, 'Le numéro WhatsApp est requis'],
    trim: true,
    match: [/^[0-9]{9,13}$/, 'Numéro de téléphone invalide'],
    default: '237600000000'
  },
  businessName: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis'],
    trim: true,
    default: 'GLA GLA Business'
  },
  businessPhone: {
    type: String,
    trim: true,
    default: '237600000000'
  },
  businessEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'contact@glagla.com'
  },
  businessAddress: {
    type: String,
    trim: true,
    default: 'Yaoundé, Cameroun'
  },
  businessDescription: {
    type: String,
    trim: true,
    default: 'Votre boutique en ligne au Cameroun'
  },
  currency: {
    type: String,
    default: 'FCFA'
  },
  currencySymbol: {
    type: String,
    default: 'FCFA'
  },
  deliveryInfo: {
    type: String,
    trim: true,
    default: 'Livraison disponible sur Yaoundé et Douala'
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  freeDeliveryThreshold: {
    type: Number,
    default: 100000,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  seo: {
    title: { type: String, default: 'GLA GLA Business - E-Commerce' },
    description: { type: String, default: 'Votre boutique en ligne au Cameroun' },
    keywords: { type: String, default: 'e-commerce, cameroun, boutique en ligne' }
  },
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: 'Site en maintenance, revenez bientôt !' }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);