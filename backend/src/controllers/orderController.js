const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create an order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    console.log('📝 Création d\'une commande...');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      total,
      notes
    } = req.body;

    // Validation des champs requis
    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et le téléphone du client sont requis'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un produit est requis'
      });
    }

    // Valider et traiter les items
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Chaque produit doit avoir: productId, name, price, quantity'
        });
      }

      // Vérifier le stock
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Produit "${item.name}" non trouvé`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour "${item.name}" (${product.stock} disponible(s))`
        });
      }

      // Mettre à jour le stock
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Créer la commande
    const order = await Order.create({
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail || ''
      },
      items: validatedItems,
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      notes: notes || '',
      status: 'pending',
      payment: {
        method: 'whatsapp',
        status: 'pending'
      },
      delivery: {
        method: 'delivery',
        notes: notes || ''
      }
    });

    console.log(`✅ Commande créée: ${order._id}`);

    res.status(201).json({
      success: true,
      order,
      message: 'Commande créée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur création commande:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande: ' + error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des commandes'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de la commande'
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // If order is cancelled, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }

    // Update status with history
    order.status = status;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: status,
      note: note || '',
      date: new Date()
    });
    await order.save();

    res.json({
      success: true,
      order,
      message: `Statut mis à jour: ${status}`
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
