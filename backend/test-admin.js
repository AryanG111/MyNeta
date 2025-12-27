const bcrypt = require('bcrypt');
const { User } = require('./models');

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@myneta.app',
      password_hash: hashedPassword,
      role: 'admin'
    });
    
    console.log('Admin user created:', admin.toJSON());
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
