const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    minlength: [10, 'La description doit contenir au moins 10 caractères']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'La description courte ne peut pas dépasser 200 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  oldPrice: {
    type: Number,
    min: [0, 'Le prix ne peut pas être négatif'],
    validate: {
      validator: function(value) {
        return !value || value > this.price;
      },
      message: 'L\'ancien prix doit être supérieur au prix actuel'
    }
  },
  images: [{
    type: String,
    required: [true, 'Au moins une image est requise']
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La catégorie est requise']
  },
  brand: {
    type: String,
    trim: true,
    default: ''
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: [0, 'Le stock ne peut pas être négatif'],
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    unit: { type: String, default: 'cm' }
  },
  tags: [{
    type: String,
    trim: true
  }],
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Le titre SEO ne peut pas dépasser 60 caractères']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'La description SEO ne peut pas dépasser 160 caractères']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for search
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text',
  tags: 'text'
});

productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ featured: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.oldPrice || this.oldPrice <= this.price) return 0;
  return Math.round((1 - this.price / this.oldPrice) * 100);
});

// Virtual for inStock
productSchema.virtual('inStock').get(function() {
  return this.available && this.stock > 0;
});

// Static method to get featured products
productSchema.statics.getFeatured = async function(limit = 8) {
  return await this.find({ featured: true, available: true, stock: { $gt: 0 } })
    .sort({ views: -1 })
    .limit(limit)
    .populate('category', 'name slug');
};

// Static method to get new arrivals
productSchema.statics.getNewArrivals = async function(limit = 8) {
  return await this.find({ available: true, stock: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category', 'name slug');
};

// Static method to get products by category
productSchema.statics.getByCategory = async function(categorySlug, limit = 20) {
  const Category = mongoose.model('Category');
  const category = await Category.findOne({ slug: categorySlug });
  if (!category) return [];
  return await this.find({ category: category._id, available: true, stock: { $gt: 0 } })
    .limit(limit)
    .populate('category', 'name slug');
};

module.exports = mongoose.model('Product', productSchema);