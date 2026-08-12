const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdminDirect() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté\n');

    // Accès direct à la collection
    const db = mongoose.connection.db;
    const collection = db.collection('admins');

    // 1. Supprimer tous les admins
    await collection.deleteMany({});
    console.log('🗑️ Admins supprimés\n');

    // 2. Générer un nouveau hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    console.log('🔑 Hash généré:', hashedPassword);

    // 3. Créer l'admin directement
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

    // 4. Vérifier
    const savedAdmin = await collection.findOne({ email: 'admin@glagla.com' });
    console.log('📋 Admin récupéré:');
    console.log('  📧 Email:', savedAdmin.email);
    console.log('  👤 Nom:', savedAdmin.name);
    console.log('  🔑 Hash:', savedAdmin.password.substring(0, 30) + '...');
    
    // 5. Tester la comparaison
    const isMatch = await bcrypt.compare('admin123', savedAdmin.password);
    console.log(`\n🔍 Test de comparaison: ${isMatch ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

    if (isMatch) {
      console.log('\n✅ Admin fonctionnel !');
      console.log('📧 Email: admin@glagla.com');
      console.log('🔑 Mot de passe: admin123');
    }

    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté');

  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
}

fixAdminDirect();
