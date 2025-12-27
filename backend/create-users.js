const bcrypt = require('bcrypt');
const { User } = require('./models');

async function createUsers() {
  try {
    // Clear existing users
    await User.destroy({ where: {} });

    // Create admin user
    const adminPassword = await bcrypt.hash('Vedish0101', 10);
    const admin = await User.create({
      name: 'Subhash Dhore',
      email: 'subhash@myneta.app',
      password_hash: adminPassword,
      role: 'admin',
      mobile: '9999999999',
      is_approved: true
    });
    console.log('Admin user created:', admin.toJSON());

    // Create volunteer user
    const volunteerPassword = await bcrypt.hash('Sahil@6055', 10);
    const volunteer = await User.create({
      name: 'Sahil Kangude',
      email: 'sahil@myneta.app',
      password_hash: volunteerPassword,
      role: 'volunteer',
      mobile: '8888888888',
      is_approved: true
    });
    console.log('Volunteer user created:', volunteer.toJSON());

    console.log('All users created successfully!');
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

createUsers();

