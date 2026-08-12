const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./src/models/Admin');

async function fixAdmin() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté\n');

    // 1. Voir l'admin actuel
    console.log('🔍 Vérification de l\'admin...');
    const admin = await Admin.findOne({ email: 'admin@glagla.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin non trouvé');
      return;
    }

    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.name);
    console.log('🔑 Hash actuel:', admin.password ? admin.password.substring(0, 30) + '...' : '❌ Pas de hash');
    console.log('📊 Tentatives:', admin.loginAttempts);
    console.log('🔓 Verrouillé:', admin.lockUntil ? 'Oui' : 'Non');

    // 2. Tester la comparaison avec bcrypt
    console.log('\n🧪 Test de comparaison avec bcrypt:');
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log(`   Résultat: ${isMatch ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

    // 3. Si échec, forcer un nouveau hash
    if (!isMatch) {
      console.log('\n🔧 Correction du mot de passe...');
      
      // Générer un nouveau hash
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash('admin123', salt);
      
      // Mettre à jour l'admin
      admin.password = newHash;
      admin.loginAttempts = 0;
      admin.lockUntil = null;
      await admin.save();
      
      console.log('✅ Mot de passe réinitialisé');
      
      // Tester à nouveau
      const retryMatch = await bcrypt.compare('admin123', admin.password);
      console.log(`🔍 Nouveau test: ${retryMatch ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    }

    // 4. Vérification finale
    console.log('\n📋 Informations finales:');
    console.log('  📧 Email: admin@glagla.com');
    console.log('  🔑 Mot de passe: admin123');
    console.log('  ✅ Statut: Actif');

    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté');

  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
}

fixAdmin();
