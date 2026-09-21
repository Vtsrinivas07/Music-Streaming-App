const mongoose = require('mongoose');

async function updateCredentials() {
  try {
    await mongoose.connect('mongodb://localhost:27017/beatbox');
    
    // Update admin
    await mongoose.connection.collection('users').updateOne(
      { username: 'admin' },
      { $set: { email: 'admin@musicbox.com', role: 'admin' } }
    );
    
    // Update regular user
    await mongoose.connection.collection('users').updateOne(
      { username: 'user' },
      { $set: { email: 'user@musicbox.com', role: 'user' } }
    );
    
    const users = await mongoose.connection.collection('users').find({}).toArray();
    console.log('Updated users in MongoDB:');
    users.forEach(u => console.log(`- ${u.username} (${u.role}): ${u.email}`));
  } catch (err) {
    console.error('Error updating credentials:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateCredentials();
