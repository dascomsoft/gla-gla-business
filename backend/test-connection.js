require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  console.log(`📡 URI: ${process.env.MONGODB_URI.replace(/<db_username>:[^@]*@/, '<username>:<password>@')}`);

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ Connection successful!');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.map(c => c.name).join(', ')}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Vérifiez que:');
    console.log('  1. L\'URL MongoDB est correcte');
    console.log('  2. Le nom d\'utilisateur et le mot de passe sont bons');
    console.log('  3. L\'IP est autorisée dans MongoDB Atlas');
    console.log('  4. Le réseau autorise la connexion');
  }
}

testConnection();
