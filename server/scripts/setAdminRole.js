const mongoose = require('mongoose');

async function setAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/musicbox');
    const res = await mongoose.connection.collection('users').updateOne(
      { username: 'admin' },
      { $set: { role: 'admin' } }
    );
    console.log('Updated admin user:', res);
    const users = await mongoose.connection.collection('users').find({}).toArray();
    console.log('Current users:', users.map(u => ({ username: u.username, email: u.email, role: u.role })));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

setAdmin();
