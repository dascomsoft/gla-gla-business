const Category = require('../models/Category');
const Product = require('../models/Product');
const { slugify } = require('../utils/slugify');

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, description, image, icon, order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la catégorie est requis'
      });
    }

    // Generate slug
    const slug = slugify(name);

    // Check if category exists
    const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Cette catégorie existe déjà'
      });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      icon: icon || 'FolderTree',
      order: order || 0,
      active: true
    });

    res.status(201).json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Create category error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { active, search, sort = 'order' } = req.query;

    // Build filter
    const filter = {};
    if (active === 'true') filter.active = true;
    if (active === 'false') filter.active = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortOptions = {};
    if (sort === 'name') sortOptions.name = 1;
    else if (sort === '-name') sortOptions.name = -1;
    else if (sort === 'productCount') sortOptions.productCount = -1;
    else sortOptions.order = 1;

    const categories = await Category.find(filter)
      .sort(sortOptions)
      .lean();

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          category: category._id,
          available: true,
          stock: { $gt: 0 }
        });
        return { ...category, productCount: count };
      })
    );

    res.json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des catégories'
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Get product count
    const productCount = await Product.countDocuments({
      category: category._id,
      available: true,
      stock: { $gt: 0 }
    });

    res.json({
      success: true,
      category: { ...category.toObject(), productCount }
    });

  } catch (error) {
    console.error('Get category error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de la catégorie'
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Get products in this category
    const products = await Product.find({
      category: category._id,
      available: true,
      stock: { $gt: 0 }
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    res.json({
      success: true,
      category,
      products,
      productCount: products.length
    });

  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de la catégorie'
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, icon, order, active } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Check if name is being changed
    if (name && name !== category.name) {
      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Cette catégorie existe déjà'
        });
      }
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = order;
    if (active !== undefined) category.active = active;

    // Regenerate slug if name changed
    if (name && name !== category.name) {
      category.slug = slugify(name);
    }

    await category.save();

    res.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Update category error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de la catégorie'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer la catégorie (${productCount} produits associés)`
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie'
    });
  }
};

// @desc    Toggle category status
// @route   PATCH /api/categories/:id/toggle
// @access  Private
const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    category.active = !category.active;
    await category.save();

    res.json({
      success: true,
      active: category.active,
      message: `Catégorie ${category.active ? 'activée' : 'désactivée'} avec succès`
    });

  } catch (error) {
    console.error('Toggle category error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de statut'
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
};