const path = require('path');
const process = require('process');
process.env.NODE_ENV = 'development';
const config = require('./backend/config/config.js').development;
config.storage = path.join(__dirname, 'backend', 'database.sqlite');

const { User, sequelize } = require('./backend/models');

async function check() {
    try {
        const users = await User.findAll({ where: { role: 'volunteer' } });
        console.log('--- VOLUNTEER USERS ---');
        users.forEach(u => {
            console.log(`JSON_START|${JSON.stringify({
                id: u.id,
                email: u.email,
                mobile: u.mobile,
                is_approved: u.is_approved,
                hash_start: u.password_hash?.substring(0, 10),
                hash_len: u.password_hash?.length
            })}|JSON_END`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
