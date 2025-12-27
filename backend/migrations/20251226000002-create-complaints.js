'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Complaints', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            voter_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Voters',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            issue: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'pending'
            },
            resolution: {
                type: Sequelize.TEXT
            },
            priority: {
                type: Sequelize.STRING,
                defaultValue: 'medium'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Complaints');
    }
};
