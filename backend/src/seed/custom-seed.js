require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const Settings = require('../models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gla-gla-business';

// ===== VOS CATÉGORIES PERSONNALISÉES =====
const customCategories = [
  { name: 'Électroménagers', slug: 'electromenagers', description: 'Appareils électroménagers', order: 1 },
  { name: 'Téléphones', slug: 'telephones', description: 'Smartphones et accessoires', order: 2 },
  { name: 'Mode Homme', slug: 'mode-homme', description: 'Vêtements et accessoires homme', order: 3 },
  { name: 'Mode Femme', slug: 'mode-femme', description: 'Vêtements et accessoires femme', order: 4 },
  { name: 'Chaussures', slug: 'chaussures', description: 'Tous types de chaussures', order: 5 },
  { name: 'Beauté', slug: 'beaute', description: 'Cosmétiques et soins', order: 6 },
  { name: 'Électronique', slug: 'electronique', description: 'Appareils électroniques', order: 7 },
  { name: 'Maison', slug: 'maison', description: 'Articles pour la maison', order: 8 },
  { name: 'Alimentation', slug: 'alimentation', description: 'Produits alimentaires', order: 9 },
  { name: 'Autres', slug: 'autres', description: 'Autres catégories', order: 10 }
];

// ===== VOS PRODUITS PERSONNALISÉS =====
// Ajoutez vos propres produits ici
const customProducts = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Le dernier flagship Samsung avec écran AMOLED 6.8", appareil photo 200MP, batterie 5000mAh',
    price: 850000,
    oldPrice: 950000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/samsung-s24-ultra'],
    brand: 'Samsung',
    stock: 10,
    available: true,
    featured: true,
    tags: ['smartphone', 'samsung', 'premium']
  },
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'iPhone 15 Pro Max avec puce A17 Pro, écran 6.7", appareil photo 48MP',
    price: 1200000,
    oldPrice: 1350000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/iphone-15-pro-max'],
    brand: 'Apple',
    stock: 8,
    available: true,
    featured: true,
    tags: ['smartphone', 'apple', 'premium']
  },
  {
    name: 'MacBook Air M3',
    slug: 'macbook-air-m3',
    description: 'MacBook Air avec puce M3, écran 13.6", 16GB RAM, 512GB SSD',
    price: 1500000,
    oldPrice: 1700000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/macbook-air-m3'],
    brand: 'Apple',
    stock: 5,
    available: true,
    featured: true,
    tags: ['ordinateur', 'apple', 'macbook']
  },
  {
    name: 'Chemise Homme Premium',
    slug: 'chemise-homme-premium',
    description: 'Chemise homme en coton égyptien, coupe slim, col italien',
    price: 25000,
    oldPrice: 35000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/chemise-homme'],
    brand: 'Fashion Luxe',
    stock: 30,
    available: true,
    featured: false,
    tags: ['chemise', 'homme', 'premium']
  },
  {
    name: 'Robe Femme Soie',
    slug: 'robe-femme-soie',
    description: 'Robe longue en soie naturelle, coupe évasée, idéale pour les occasions',
    price: 45000,
    oldPrice: 55000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/robe-femme-soie'],
    brand: 'Élégance',
    stock: 15,
    available: true,
    featured: true,
    tags: ['robe', 'femme', 'soie']
  },
  {
    name: 'Basket Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Basket Nike Air Max 270, confortable et tendance',
    price: 85000,
    oldPrice: 105000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/nike-air-max-270'],
    brand: 'Nike',
    stock: 12,
    available: true,
    featured: true,
    tags: ['basket', 'nike', 'sport']
  },
  {
    name: 'Sac à Dos Eastpak',
    slug: 'sac-eastpak',
    description: 'Sac à dos Eastpak Padded, résistant et confortable',
    price: 30000,
    oldPrice: 38000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/eastpak-backpack'],
    brand: 'Eastpak',
    stock: 20,
    available: true,
    featured: false,
    tags: ['sac', 'eastpak']
  },
  {
    name: 'Casque Sony WH-1000XM5',
    slug: 'casque-sony-wh1000xm5',
    description: 'Casque Sony avec réduction de bruit active, autonomie 30h',
    price: 45000,
    oldPrice: 55000,
    images: ['https://res.cloudinary.com/demo/image/upload/v1/sony-headphones'],
    brand: 'Sony',
    stock: 8,
    available: true,
    featured: true,
    tags: ['casque', 'sony', 'audio']
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

async function customSeed() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Clear existing data
    console.log('🧹 Suppression des données existantes...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Données existantes supprimées');

    // Create categories
    console.log('📁 Création des catégories...');
    const categories = await Category.insertMany(customCategories);
    console.log(`✅ ${categories.length} catégories créées`);

    // Create category mapping
    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.name] = c._id; });

    // Create products
    console.log('📦 Création des produits...');
    const productsWithCategories = customProducts.map(product => {
      // Map category name to ID
      const categoryKey = Object.keys(categoryMap).find(key => 
        product.tags.includes(key.toLowerCase()) || 
        categories.find(c => c.name === product.tags[0])
      );
      const categoryId = categoryMap[categoryKey] || categories[0]._id;
      
      return {
        ...product,
        category: categoryId
      };
    });

    await Product.insertMany(productsWithCategories);
    console.log(`✅ ${productsWithCategories.length} produits créés`);

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
    console.log(`   🔑 Mot de passe: ${adminData.password}`);

    // Create settings
    console.log('⚙️ Création des paramètres...');
    await Settings.create(settingsData);
    console.log('✅ Paramètres créés');

    console.log('\n🎉 Seed personnalisé terminé avec succès !');
    console.log('📊 Résumé:');
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${productsWithCategories.length} produits`);
    console.log(`   - 1 administrateur`);
    console.log(`   - 1 configuration`);
    console.log('\n🔗 Accès admin:');
    console.log(`   📧 ${adminData.email}`);
    console.log(`   🔑 ${adminData.password}`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Run seed
customSeed();