'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'mobile', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'area', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'avatar_path', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'is_approved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Users', 'approved_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Users', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Update role enum to include 'voter'
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'volunteer', 'voter'),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'mobile');
    await queryInterface.removeColumn('Users', 'area');
    await queryInterface.removeColumn('Users', 'is_approved');
    await queryInterface.removeColumn('Users', 'approved_by');
    await queryInterface.removeColumn('Users', 'approved_at');

    // Revert role enum to original
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'volunteer'),
      allowNull: false
    });
  }
};
