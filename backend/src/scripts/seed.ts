import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import Property from '../models/property.model';
import User from '../models/user.model';

// Load environment variables
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentlee';

// Path to raw JSON data
const dataPath = path.resolve(__dirname, '../../../frontend/src/data/main_data_with_coords.json');

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected for seeding.');

    console.log('🧹 Wiping existing properties to ensure clean data state...');
    await Property.deleteMany({});
    console.log('🗑️ Existing properties cleared.');

    // Find or create a default owner (lister role is required logically by your system, but not strictly by mongoose)
    let defaultOwner = await User.findOne({ username: 'seed_owner_admin' });
    if (!defaultOwner) {
      defaultOwner = await User.create({
        username: 'seed_owner_admin',
        email: 'seeder@rentlee.com',
        password: 'securepassword123', // Will be hashed securely via pre-save
        role: 'lister',
        listerStatus: 'approved',
        isVerified: true,
      });
      console.log('👤 Created default seed_owner_admin to associate with properties.');
    }

    // Read the dummy data
    console.log('📖 Reading raw property JSON data from frontend directory...');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const propertiesData = JSON.parse(rawData);

    // Map the properties
    console.log('🔄 Mapping formatting logic and seeding batches...');
    
    // We only take valid entries (e.g., must have title, rent, city etc)
    const validProperties = propertiesData
      .filter((prop: any) => prop && prop.title && prop.rent)
      .map((prop: any) => ({
        title: prop.title,
        description: 'Excellent property built specifically for comfortable living, well-equipped with primary conveniences.',
        rent: Number(prop.rent),
        city: prop.city || 'Unknown',
        locality: prop.locality || 'Unknown',
        state: prop.state || 'Unknown',
        category: ['Apartment', 'House', 'Condo', 'Studio', 'Villa'].includes(prop.category) ? prop.category : 'Apartment',
        bedrooms: Number(prop.bedrooms) || 0,
        bathrooms: Number(prop.bathrooms) || 0,
        area_sqft: Number(prop.area_sqft) || 500,
        furnishing: String(prop.furnishing).includes('Fully') 
          ? 'Furnished' 
          : (['Furnished', 'Semi-Furnished', 'Unfurnished'].includes(prop.furnishing) 
              ? prop.furnishing 
              : 'Unfurnished'),
        available_from: prop.available_from || new Date().toISOString().split('T')[0],
        image_url: prop.image_url || '',
        contact: prop.contact || 'contact_missing',
        latitude: prop.lat ? Number(prop.lat) : undefined,
        longitude: prop.lng ? Number(prop.lng) : undefined,
        amenities: ['Parking', 'Water Supply', 'Power Backup'], // Generic defaults
        owner: defaultOwner._id,
        isActive: true,
      }));

    // Seed into MongoDB using insertMany securely
    await Property.insertMany(validProperties);
    
    console.log(`✅ Seed Execution Successful. Loaded ${validProperties.length} Properties strictly to DB.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Data seed script failed brutally:', error);
    process.exit(1);
  }
};

seedDatabase();
