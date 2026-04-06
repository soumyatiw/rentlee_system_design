import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
