const Product = require('../models/Product');
const Category = require('../models/Category');
const { slugify } = require('../utils/slugify');
const cloudinaryService = require('../services/cloudinaryService');

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      images,
      category,
      brand,
      stock,
      available,
      featured,
      specifications,
      tags,
      metaTitle,
      metaDescription
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Les champs requis sont manquants (nom, description, prix, catégorie, images)'
      });
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie invalide'
      });
    }

    // Generate slug
    const slug = slugify(name);

    // Check if slug exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Un produit avec ce nom existe déjà'
      });
    }

    // Create product
    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription: description.substring(0, 200),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      images,
      category,
      brand: brand || '',
      stock: Number(stock) || 0,
      available: available === 'true' || available === true,
      featured: featured === 'true' || featured === true,
      specifications: specifications || {},
      tags: tags || [],
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || description.substring(0, 160)
    });

    // Update category product count
    await Category.findByIdAndUpdate(category, {
      $inc: { productCount: 1 }
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit'
    });
  }
};

// @desc    Get all products with pagination and filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      available,
      featured,
      sort = '-createdAt',
      tags
    } = req.query;

    // Build filter
    const filter = {};

    // Search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Availability
    if (available === 'true') {
      filter.available = true;
      filter.stock = { $gt: 0 };
    } else if (available === 'false') {
      filter.available = false;
    }

    // Featured
    if (featured === 'true') {
      filter.featured = true;
    }

    // Tags
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Math.min(Number(limit), 100);

    // Build sort
    const sortOptions = {};
    if (sort === 'price') sortOptions.price = 1;
    else if (sort === '-price') sortOptions.price = -1;
    else if (sort === 'name') sortOptions.name = 1;
    else if (sort === '-name') sortOptions.name = -1;
    else if (sort === '-views') sortOptions.views = -1;
    else sortOptions.createdAt = -1;

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(filter);

    // Get product counts by category for filters
    const categories = await Category.find({ active: true })
      .select('name slug _id');

    // Get brands for filters
    const brands = await Product.distinct('brand', { brand: { $ne: '' } });

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      filters: {
        categories,
        brands: brands.sort()
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des produits'
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Increment views
    await Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } });

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      available: true,
      stock: { $gt: 0 }
    })
    .limit(4)
    .lean();

    res.json({
      success: true,
      product,
      relatedProducts
    });

  } catch (error) {
    console.error('Get product error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du produit'
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Increment views
    await Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } });

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      available: true,
      stock: { $gt: 0 }
    })
    .limit(4)
    .lean();

    res.json({
      success: true,
      product,
      relatedProducts
    });

  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du produit'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Check if category is being changed
    if (updates.category && updates.category !== product.category.toString()) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Catégorie invalide'
        });
      }
      // Update category counts
      await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
      await Category.findByIdAndUpdate(updates.category, { $inc: { productCount: 1 } });
    }

    // Check if name is being changed
    if (updates.name && updates.name !== product.name) {
      const slug = slugify(updates.name);
      const existing = await Product.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Un produit avec ce nom existe déjà'
        });
      }
      updates.slug = slug;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du produit'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await cloudinaryService.deleteImages(product.images);
    }

    // Update category product count
    await Category.findByIdAndUpdate(product.category, {
      $inc: { productCount: -1 }
    });

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit'
    });
  }
};

// @desc    Toggle product availability
// @route   PATCH /api/products/:id/toggle
// @access  Private
const toggleProductAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    product.available = !product.available;
    await product.save();

    res.json({
      success: true,
      available: product.available,
      message: `Produit ${product.available ? 'disponible' : 'indisponible'}`
    });

  } catch (error) {
    console.error('Toggle product error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de disponibilité'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.getFeatured(limit);

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des produits vedettes'
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.getNewArrivals(limit);

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des nouveautés'
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getFeaturedProducts,
  getNewArrivals
};