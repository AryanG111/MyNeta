'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password_hash = await bcrypt.hash('Admin@123', parseInt(process.env.BCRYPT_ROUNDS || '10', 10));
    await queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@myneta.local',
      password_hash,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@myneta.local' }, {});
  }
};
