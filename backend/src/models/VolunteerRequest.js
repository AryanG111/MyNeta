const { DataTypes } = require('sequelize');
const sequelize = require('../../models').sequelize;

const VolunteerRequest = sequelize.define('VolunteerRequest', {
	name: { type: DataTypes.STRING, allowNull: false },
	email: { type: DataTypes.STRING, allowNull: false },
	phone: { type: DataTypes.STRING, allowNull: false },
	password_hash: { type: DataTypes.STRING, allowNull: false },
	avatar_path: { type: DataTypes.STRING },
	message: { type: DataTypes.TEXT },
	status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
	request_type: { type: DataTypes.ENUM('volunteer', 'voter'), defaultValue: 'volunteer' }
}, {
	tableName: 'volunteer_requests'
});

module.exports = VolunteerRequest;


