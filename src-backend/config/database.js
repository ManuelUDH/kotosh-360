const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error MongoDB:', err.message);
    console.warn('⚠️  Advertencia: No se pudo establecer la conexión con MongoDB.');
    console.warn('   El servidor seguirá activo, pero las consultas que requieran base de datos fallarán.');
    console.warn('   Asegúrate de que MongoDB esté instalado y ejecutándose en: ' + process.env.MONGODB_URI);
  }
};

module.exports = connectDB;
