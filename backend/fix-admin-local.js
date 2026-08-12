const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Forcer le chargement de .env.local
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function fixAdminLocal() {
    try {
        console.log('📦 Connexion à MongoDB...');
        console.log(`🔗 URI: ${process.env.MONGODB_URI ? '✅ Configurée' : '❌ Non configurée'}`);
        
        // Afficher la base de données cible
        const dbName = process.env.MONGODB_URI ? process.env.MONGODB_URI.split('/').pop() : 'inconnue';
        console.log(`🗄️ Base de données: ${dbName}`);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté\n');

        // Accès direct à la collection
        const db = mongoose.connection.db;
        const collection = db.collection('admins');

        // 1. Compter les admins existants
        const count = await collection.countDocuments();
        console.log(`📊 ${count} admin(s) trouvé(s)`);

        // 2. Supprimer tous les admins
        await collection.deleteMany({});
        console.log('🗑️ Admins supprimés\n');

        // 3. Générer un nouveau hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        console.log('🔑 Nouveau hash généré');

        // 4. Créer l'admin directement
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

        // 5. Vérifier
        const savedAdmin = await collection.findOne({ email: 'admin@glagla.com' });
        console.log('📋 Admin récupéré:');
        console.log('  📧 Email:', savedAdmin.email);
        console.log('  👤 Nom:', savedAdmin.name);
        console.log('  ✅ Actif:', savedAdmin.active);
        
        // 6. Tester la comparaison
        const isMatch = await bcrypt.compare('admin123', savedAdmin.password);
        console.log(`\n🔍 Test de comparaison: ${isMatch ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

        if (isMatch) {
            console.log('\n✅ Admin fonctionnel !');
            console.log('📧 Email: admin@glagla.com');
            console.log('🔑 Mot de passe: admin123');
            console.log(`🗄️ Base de données: ${dbName}`);
        } else {
            console.log('\n❌ La comparaison a échoué.');
        }

        await mongoose.disconnect();
        console.log('\n🔌 Déconnecté');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        await mongoose.disconnect();
    }
}

fixAdminLocal();
