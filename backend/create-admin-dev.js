const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Charger .env.local
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function createAdminDev() {
  try {
    console.log('📦 Connexion à MongoDB...');
    console.log(`🗄️ Base: ${process.env.MONGODB_URI || 'Non définie'}`);
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI non défini dans .env.local');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté\n');

    const db = mongoose.connection.db;
    const collection = db.collection('admins');

    // Compter les admins existants
    const count = await collection.countDocuments();
    console.log(`📊 ${count} admin(s) trouvé(s)`);

    // Supprimer les admins existants
    const deleted = await collection.deleteMany({});
    console.log(`🗑️ ${deleted.deletedCount} admin(s) supprimé(s)`);

    // Créer le nouvel admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminData = {
      name: 'Administrator',
      email: 'admin@glagla.com',
      password: hashedPassword,
      active: true,
      role: 'admin',
      loginAttempts: 0,
      lockUntil: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(adminData);
    console.log('✅ Admin créé\n');

    // Vérifier
    const savedAdmin = await collection.findOne({ email: 'admin@glagla.com' });
    console.log('📋 Admin récupéré:');
    console.log('  📧 Email:', savedAdmin.email);
    console.log('  👤 Nom:', savedAdmin.name);
    console.log('  ✅ Actif:', savedAdmin.active);

    const isMatch = await bcrypt.compare('admin123', savedAdmin.password);
    console.log(`  🔍 Mot de passe: ${isMatch ? '✅ OK' : '❌ Échec'}`);

    if (isMatch) {
      console.log('\n🎉 Admin fonctionnel !');
      console.log('📧 admin@glagla.com');
      console.log('🔑 admin123');
    } else {
      console.log('\n⚠️ Problème avec le mot de passe');
    }

    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    await mongoose.disconnect();
  }
}

createAdminDev();
