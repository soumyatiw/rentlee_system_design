const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function reassign() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the target user (hardcoded as harshita@gmail.com for now as it's the primary account)
    const targetUser = await mongoose.connection.db.collection('users').findOne({ email: 'harshita@gmail.com' });
    
    if (!targetUser) {
      console.error('Target user harshita@gmail.com not found. Finding first available lister...');
      const firstLister = await mongoose.connection.db.collection('users').findOne({ role: 'lister' });
      if (!firstLister) {
        console.error('No listers found in database.');
        await mongoose.disconnect();
        return;
      }
      targetUser = firstLister;
    }

    console.log(`Reassigning all properties to: ${targetUser.email} (${targetUser._id})`);

    const result = await mongoose.connection.db.collection('properties').updateMany(
      {},
      { $set: { owner: targetUser._id } }
    );

    console.log(`Successfully reassigned ${result.modifiedCount} properties.`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Reassignment failed:', err);
  }
}

reassign();
