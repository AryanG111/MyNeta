'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create admin user
    const adminPassword = await bcrypt.hash('Vedish0101', 10);
    const volunteerPassword = await bcrypt.hash('Sahil@6055', 10);

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Subhash',
        email: 'subhash@myneta.app',
        password_hash: adminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Sahil Kangude',
        email: 'sahil@myneta.app',
        password_hash: volunteerPassword,
        role: 'volunteer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: ['admin@myneta.app', 'volunteer@myneta.app']
    });
  }
};
