'use strict';

const bcrypt = require('bcrypt');

module.exports = {
	async up (queryInterface, Sequelize) {
		const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
		const now = new Date();
		// Clean any prior test users
		await queryInterface.bulkDelete('Users', { email: ['subhash@example.com','sahil@example.com','subhash@myneta.app','sahil@myneta.app'] }, {});
		const users = [
			{ name: 'Subhash', email: 'subhash@myneta.app', mobile: '9999999001', role: 'admin', is_approved: true, password_plain: 'Vedish0101' },
			{ name: 'Sahil', email: 'sahil@myneta.app', mobile: '9999999002', role: 'volunteer', is_approved: true, password_plain: 'Sahil@6055' }
		];
		for (const u of users) {
			u.password_hash = await bcrypt.hash(u.password_plain, rounds);
			delete u.password_plain;
			u.createdAt = now;
			u.updatedAt = now;
		}
		return queryInterface.bulkInsert('Users', users, {});
	},

	async down (queryInterface, Sequelize) {
		return queryInterface.bulkDelete('Users', { email: ['subhash@myneta.app','sahil@myneta.app'] }, {});
	}
};


