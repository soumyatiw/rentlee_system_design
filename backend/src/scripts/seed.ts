import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRepository from '../repositories/user.repository';
import { UserFactory } from '../services/user.factory';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@rentlee.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'Rentlee Admin';

const seedAdmin = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const existingAdmin = await userRepository.findByEmail(ADMIN_EMAIL);
    if (existingAdmin) {
      console.log('⚠️ Admin already exists in the database. Exiting seed script.');
      process.exit(0);
    }

    // Factory Pattern: Create the Admin structure cleanly
    const adminData = UserFactory.create('admin', {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    await userRepository.create(adminData);

    console.log('🚀 Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
