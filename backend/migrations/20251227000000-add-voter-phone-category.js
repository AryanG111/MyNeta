'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Voters', 'phone', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Voters', 'category', {
            type: Sequelize.STRING,
            defaultValue: 'neutral',
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Voters', 'phone');
        await queryInterface.removeColumn('Voters', 'category');
    }
};
