const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Admin = require('./src/models/Admin');
const Settings = require('./src/models/Settings');

async function forceSeed() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté');
    
    // Supprimer tout
    console.log('🧹 Suppression des données existantes...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Données supprimées');
    
    // Catégories
    console.log('\n📁 Création des catégories...');
    const categories = await Category.create([
      { name: 'Électroménagers', slug: 'electromenagers', description: 'Appareils électroménagers', active: true, order: 1 },
      { name: 'Téléphones', slug: 'telephones', description: 'Smartphones et accessoires', active: true, order: 2 },
      { name: 'Mode Homme', slug: 'mode-homme', description: 'Vêtements et accessoires homme', active: true, order: 3 },
      { name: 'Mode Femme', slug: 'mode-femme', description: 'Vêtements et accessoires femme', active: true, order: 4 },
      { name: 'Chaussures', slug: 'chaussures', description: 'Tous types de chaussures', active: true, order: 5 },
      { name: 'Beauté', slug: 'beaute', description: 'Cosmétiques et soins', active: true, order: 6 },
      { name: 'Électronique', slug: 'electronique', description: 'Appareils électroniques', active: true, order: 7 },
      { name: 'Maison', slug: 'maison', description: 'Articles pour la maison', active: true, order: 8 },
      { name: 'Alimentation', slug: 'alimentation', description: 'Produits alimentaires', active: true, order: 9 }
    ]);
    console.log(`✅ ${categories.length} catégories créées`);
    
    // Produits
    console.log('\n📦 Création des produits...');
    const products = await Product.create([
      {
        name: 'Samsung Galaxy A15',
        slug: 'samsung-galaxy-a15',
        description: 'Smartphone Samsung Galaxy A15 avec écran 6.5 pouces, 128GB',
        price: 85000,
        oldPrice: 95000,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samsung-galaxy-a15'],
        category: categories[1]._id,
        brand: 'Samsung',
        stock: 15,
        available: true,
        featured: true
      },
      {
        name: 'T-shirt Homme Premium',
        slug: 'tshirt-homme-premium',
        description: 'T-shirt homme en coton bio premium, coupe classique',
        price: 10000,
        oldPrice: 15000,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/tshirt-homme'],
        category: categories[2]._id,
        brand: 'Fashion Premium',
        stock: 50,
        available: true,
        featured: false
      },
      {
        name: 'Casque Sony WH-1000XM5',
        slug: 'casque-sony-wh1000xm5',
        description: 'Casque Sony avec réduction de bruit active, autonomie 30h',
        price: 45000,
        oldPrice: 55000,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sony-headphones'],
        category: categories[6]._id,
        brand: 'Sony',
        stock: 8,
        available: true,
        featured: true
      },
      {
        name: 'Basket Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Basket Nike Air Max 270, confortable et tendance',
        price: 85000,
        oldPrice: 105000,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/nike-air-max-270'],
        category: categories[4]._id,
        brand: 'Nike',
        stock: 12,
        available: true,
        featured: true
      }
    ]);
    console.log(`✅ ${products.length} produits créés`);
    
    // Admin
    console.log('\n👤 Création de l\'administrateur...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await Admin.create({
      name: 'Administrator',
      email: 'admin@glagla.com',
      password: hashedPassword,
      active: true
    });
    console.log('✅ Admin créé: admin@glagla.com / admin123');
    
    // Settings
    console.log('\n⚙️ Création des paramètres...');
    await Settings.create({
      whatsappNumber: '237600000000',
      businessName: 'GLA GLA Business',
      businessPhone: '237600000000',
      businessEmail: 'contact@glagla.com',
      businessAddress: 'Yaoundé, Cameroun',
      businessDescription: 'Votre boutique en ligne au Cameroun',
      currency: 'FCFA',
      deliveryInfo: 'Livraison disponible sur Yaoundé et Douala'
    });
    console.log('✅ Settings créés');
    
    console.log('\n🎉 Seed forcé terminé avec succès !');
    console.log('📊 Résumé:');
    console.log(`  - ${categories.length} catégories`);
    console.log(`  - ${products.length} produits`);
    console.log('  - 1 admin');
    console.log('  - 1 settings');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté');
  }
}

forceSeed();
