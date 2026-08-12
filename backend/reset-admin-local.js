const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAdmin() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté\n');

    const Admin = require('./src/models/Admin');
    
    // 1. Supprimer tous les admins existants
    const deleteResult = await Admin.deleteMany({});
    console.log(`🗑️ ${deleteResult.deletedCount} admins supprimés\n`);

    // 2. Créer un nouvel admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await Admin.create({
      name: 'Administrator',
      email: 'admin@glagla.com',
      password: hashedPassword,
      active: true,
      role: 'admin',
      loginAttempts: 0,
      lockUntil: null
    });

    console.log('✅ Admin créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe: admin123');
    console.log('�� Nom:', admin.name);
    console.log('✅ Actif:', admin.active);
    console.log('📊 Tentatives:', admin.loginAttempts);

    // 3. Vérifier le mot de passe
    const isMatch = await admin.comparePassword('admin123');
    console.log('\n🔍 Vérification du mot de passe:', isMatch ? '✅ OK' : '❌ Échec');

    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    await mongoose.disconnect();
  }
}

resetAdmin();
