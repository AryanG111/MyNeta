const { DataTypes } = require('sequelize');
const sequelize = require('../../models').sequelize;

const VoterRequest = sequelize.define('VoterRequest', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT },
    area: { type: DataTypes.STRING },
    ward_no: { type: DataTypes.STRING },
    voter_id: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' }
}, {
    tableName: 'voter_requests'
});

module.exports = VoterRequest;
