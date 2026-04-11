const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function checkOwnership() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const sample = await mongoose.connection.db.collection('properties').findOne({});
    console.log('Sample Property:', JSON.stringify(sample, null, 2));

    const withoutOwner = await mongoose.connection.db.collection('properties').countDocuments({ owner: { $exists: false } });
    console.log('Properties without owner field:', withoutOwner);

    const users = await mongoose.connection.db.collection('users').find({ role: 'lister' }).toArray();
    console.log('Lister Users:', users.map(u => ({ id: u._id, email: u.email })));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Check failed:', err);
  }
}

checkOwnership();
