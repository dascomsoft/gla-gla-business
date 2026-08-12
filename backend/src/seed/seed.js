require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const Settings = require('../models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gla-gla-business';

// ===== CATÉGORIES DE BASE =====
const baseCategories = [
  { name: 'Électroménagers', slug: 'electromenagers', description: 'Appareils électroménagers', active: true, order: 1 },
  { name: 'Téléphones et Accessoires', slug: 'telephones-et-accessoires', description: 'Smartphones et accessoires', active: true, order: 2 },
  { name: 'Vêtements Hommes', slug: 'vetements-hommes', description: 'Mode homme', active: true, order: 3 },
  { name: 'Vêtements Femmes', slug: 'vetements-femmes', description: 'Mode femme', active: true, order: 4 },
  { name: 'Vêtements Enfants', slug: 'vetements-enfants', description: 'Mode enfant', active: true, order: 5 },
  { name: 'Chaussures', slug: 'chaussures', description: 'Tous types de chaussures', active: true, order: 6 },
  { name: 'Cosmétiques et Beauté', slug: 'cosmetiques-et-beaute', description: 'Produits de beauté et cosmétiques', active: true, order: 7 },
  { name: 'Sacs et Accessoires', slug: 'sacs-et-accessoires', description: 'Sacs, ceintures et accessoires', active: true, order: 8 },
  { name: 'Électronique', slug: 'electronique', description: 'Appareils électroniques', active: true, order: 9 },
  { name: 'Maison', slug: 'maison', description: 'Articles pour la maison', active: true, order: 10 },
  { name: 'Produits alimentaires', slug: 'produits-alimentaires', description: 'Alimentation et épicerie', active: true, order: 11 },
  { name: 'Autres', slug: 'autres', description: 'Autres catégories', active: true, order: 12 }
];

// ===== PRODUITS DE BASE =====
const baseProducts = [
  {
    name: 'Samsung Galaxy A15',
    slug: 'samsung-galaxy-a15',
    description: 'Smartphone Samsung Galaxy A15 avec écran 6.5 pouces, 128GB, 4GB RAM',
    price: 85000,
    oldPrice: 95000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/samsung-galaxy-a15'],
    brand: 'Samsung',
    stock: 15,
    available: true,
    featured: true,
    tags: ['smartphone', 'samsung', 'android']
  },
  {
    name: 'T-shirt Homme Premium',
    slug: 't-shirt-homme-premium',
    description: 'T-shirt homme en coton bio premium, coupe classique',
    price: 10000,
    oldPrice: 15000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/tshirt-homme'],
    brand: 'Fashion Premium',
    stock: 50,
    available: true,
    featured: false,
    tags: ['t-shirt', 'homme', 'coton']
  },
  {
    name: 'Casque Bluetooth Sony',
    slug: 'casque-bluetooth-sony',
    description: 'Casque audio Bluetooth Sony avec réduction de bruit active',
    price: 45000,
    oldPrice: 55000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/sony-headphones'],
    brand: 'Sony',
    stock: 8,
    available: true,
    featured: true,
    tags: ['casque', 'bluetooth', 'sony']
  },
  {
    name: 'Basket Nike Air Max 270',
    slug: 'basket-nike-air-max-270',
    description: 'Basket Nike Air Max 270 confortable et stylée',
    price: 60000,
    oldPrice: 75000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/nike-air-max-270'],
    brand: 'Nike',
    stock: 12,
    available: true,
    featured: true,
    tags: ['basket', 'nike', 'sport']
  }
];

// ===== ADMIN =====
const adminData = {
  name: 'Administrator',
  email: 'admin@glagla.com',
  password: 'admin123'
};

// ===== SETTINGS =====
const settingsData = {
  whatsappNumber: '237600000000',
  businessName: 'GLA GLA Business',
  businessPhone: '237600000000',
  businessEmail: 'contact@glagla.com',
  businessAddress: 'Yaoundé, Cameroun',
  businessDescription: 'Votre boutique en ligne au Cameroun',
  currency: 'FCFA',
  deliveryInfo: 'Livraison disponible sur Yaoundé et Douala'
};

async function seedDatabase() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connecté à ${mongoose.connection.name}\n`);

    // Clear existing data
    console.log('🧹 Suppression des données existantes...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Données supprimées\n');

    // Create categories
    console.log('📁 Création des catégories...');
    const categories = await Category.insertMany(baseCategories);
    console.log(`✅ ${categories.length} catégories créées`);

    // Create category mapping
    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.name] = c._id; });

    // Create products
    console.log('📦 Création des produits...');
    const productsWithCategories = baseProducts.map(product => {
      const categoryKey = Object.keys(categoryMap).find(key => 
        product.tags && product.tags.includes(key.toLowerCase())
      );
      const categoryId = categoryMap[categoryKey] || categories[0]._id;
      
      return {
        ...product,
        category: categoryId
      };
    });

    await Product.insertMany(productsWithCategories);
    console.log(`✅ ${productsWithCategories.length} produits créés\n`);

    // Create admin
    console.log('👤 Création de l\'administrateur...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);
    await Admin.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      active: true
    });
    console.log('✅ Administrateur créé');
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   🔑 Mot de passe: ${adminData.password}\n`);

    // Create settings
    console.log('⚙️ Création des paramètres...');
    await Settings.create(settingsData);
    console.log('✅ Paramètres créés\n');

    console.log('🎉 Seed terminé avec succès !');
    console.log('📊 Résumé:');
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${productsWithCategories.length} produits`);
    console.log(`   - 1 administrateur`);
    console.log(`   - 1 configuration`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté');
  }
}

// Run seed
seedDatabase();
