const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdminFinal() {
  try {
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté\n');

    // Accès direct à la collection
    const db = mongoose.connection.db;
    const collection = db.collection('admins');

    // Supprimer tous les admins
    console.log('🗑️  Suppression des admins existants...');
    await collection.deleteMany({});
    console.log('✅ Admins supprimés\n');

    // Générer le hash manuellement avec bcrypt
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('🔑 Hash généré:', hashedPassword);
    console.log('📝 Mot de passe original:', password);
    console.log('\n');

    // Créer l'admin directement avec le hash
    const adminData = {
      name: 'Administrator',
      email: 'admin@glagla.com',
      password: hashedPassword,
      active: true,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(adminData);
    console.log('✅ Admin créé avec ID:', result.insertedId);

    // Récupérer l'admin créé
    const savedAdmin = await collection.findOne({ email: 'admin@glagla.com' });
    
    console.log('\n📋 Données de l\'admin:');
    console.log('  Email:', savedAdmin.email);
    console.log('  Nom:', savedAdmin.name);
    console.log('  Hash:', savedAdmin.password.substring(0, 30) + '...');

    // Tester la comparaison avec bcrypt directement
    console.log('\n🔍 Test de comparaison avec bcrypt:');
    const testCompare = await bcrypt.compare('admin123', savedAdmin.password);
    console.log('  Résultat:', testCompare ? '✅ SUCCÈS' : '❌ ÉCHEC');

    if (testCompare) {
      console.log('\n✅ ADMIN FONCTIONNEL !');
      console.log('\n📋 INFORMATIONS DE CONNEXION:');
      console.log('  URL: http://localhost:3000/admin/login');
      console.log('  Email: admin@glagla.com');
      console.log('  Mot de passe: admin123');
    } else {
      console.log('\n❌ La comparaison échoue encore.');
      console.log('📌 Tentative avec un salt différent...');
      
      // Essayer avec un salt différent
      const newSalt = await bcrypt.genSalt(8);
      const newHash = await bcrypt.hash('admin123', newSalt);
      
      await collection.updateOne(
        { email: 'admin@glagla.com' },
        { $set: { password: newHash } }
      );
      
      const updatedAdmin = await collection.findOne({ email: 'admin@glagla.com' });
      const retryCompare = await bcrypt.compare('admin123', updatedAdmin.password);
      console.log('  Nouveau test:', retryCompare ? '✅ SUCCÈS' : '❌ ÉCHEC');
      
      if (retryCompare) {
        console.log('\n✅ ADMIN FONCTIONNEL !');
        console.log('\n📋 INFORMATIONS DE CONNEXION:');
        console.log('  URL: http://localhost:3000/admin/login');
        console.log('  Email: admin@glagla.com');
        console.log('  Mot de passe: admin123');
      }
    }

    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté');

  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
}

fixAdminFinal();
