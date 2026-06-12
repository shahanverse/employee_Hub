const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_db', {
      serverSelectionTimeoutMS: 5000 // fail fast in 5 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n================================================================');
    console.error('DATABASE CONNECTION ERROR:');
    console.error(error.message);
    global.useMockDb = true;
    console.warn('⚠️  FALLBACK ACTIVE: Server is running with a Local JSON File Database!');
    console.warn('⚠️  Admin and Employee records will be saved to: backend/data/*.json');
    console.error('================================================================\n');
  }
};

module.exports = connectDB;
