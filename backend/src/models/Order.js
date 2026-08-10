const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      district: { type: String, trim: true },
      country: { type: String, default: 'Cameroun' }
    }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['whatsapp', 'cash', 'mobile_money', 'bank_transfer'],
      default: 'whatsapp'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  delivery: {
    method: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'delivery'
    },
    preferredDate: Date,
    notes: String
  },
  notes: {
    type: String,
    trim: true
  },
  whatsappMessage: {
    type: String
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Générer le numéro de commande avant la sauvegarde
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      const year = new Date().getFullYear().toString().slice(-2);
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const day = String(new Date().getDate()).padStart(2, '0');
      const num = String(count + 1).padStart(4, '0');
      this.orderNumber = `GL-${year}${month}${day}-${num}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Order', orderSchema);
