const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importer le modèle Admin
const Admin = require('./src/models/Admin');

async function fixAdmin() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté\n');

    // 1. Supprimer tous les admins
    console.log('🗑️  Suppression des admins existants...');
    await Admin.deleteMany({});
    console.log('✅ Admins supprimés\n');

    // 2. Créer un nouvel admin avec le bon hash
    console.log('👤 Création du nouvel admin...');
    
    // Générer le hash manuellement
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new Admin({
      name: 'Administrator',
      email: 'admin@glagla.com',
      password: hashedPassword,
      active: true,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin créé avec succès\n');

    // 3. Vérification détaillée
    console.log('🔍 VÉRIFICATION DÉTAILLÉE:\n');

    // Récupérer l'admin avec le mot de passe
    const savedAdmin = await Admin.findOne({ email: 'admin@glagla.com' }).select('+password');
    
    console.log(`📧 Email: ${savedAdmin.email}`);
    console.log(`👤 Nom: ${savedAdmin.name}`);
    console.log(`✅ Actif: ${savedAdmin.active}`);
    console.log(`🔑 Hash du mot de passe: ${savedAdmin.password.substring(0, 30)}...`);

    // Tester la comparaison avec bcrypt directement
    console.log('\n🔍 Test avec bcrypt.compare:');
    const directCompare = await bcrypt.compare('admin123', savedAdmin.password);
    console.log(`   Résultat: ${directCompare ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

    // Tester la méthode comparePassword du modèle
    console.log('\n🔍 Test avec admin.comparePassword():');
    const methodCompare = await savedAdmin.comparePassword('admin123');
    console.log(`   Résultat: ${methodCompare ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

    if (!directCompare || !methodCompare) {
      console.log('\n⚠️  Les tests échouent. Tentative de correction...');
      
      // Forcer le hash avec un salt différent
      const newSalt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash('admin123', newSalt);
      
      savedAdmin.password = newHash;
      await savedAdmin.save();
      
      // Réessayer
      const retryCompare = await bcrypt.compare('admin123', savedAdmin.password);
      console.log(`   Nouveau test: ${retryCompare ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    }

    console.log('\n📋 INFORMATIONS POUR LA CONNEXION:');
    console.log('   URL: http://localhost:3000/admin/login');
    console.log('   Email: admin@glagla.com');
    console.log('   Mot de passe: admin123');

    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté');

  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
}

fixAdmin();
