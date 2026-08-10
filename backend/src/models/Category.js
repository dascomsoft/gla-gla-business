const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    trim: true,
    unique: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide (utilisez uniquement des lettres minuscules, chiffres et tirets)']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'FolderTree'
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  productCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for products
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

// Pre-remove hook to handle product references
categorySchema.pre('remove', async function(next) {
  const Product = mongoose.model('Product');
  try {
    // Update products to remove category reference
    await Product.updateMany(
      { category: this._id },
      { $unset: { category: 1 } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to get category with products
categorySchema.statics.getWithProducts = async function(slug) {
  return await this.findOne({ slug })
    .populate({
      path: 'products',
      match: { available: true, stock: { $gt: 0 } }
    });
};

module.exports = mongoose.model('Category', categorySchema);